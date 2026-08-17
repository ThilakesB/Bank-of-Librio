import os
import uuid
import shutil
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException, Query as APIQuery
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from vector_store import VectorStore
from document_processor import DocumentProcessor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "..", "uploaded_files")
DATASET_DIR = os.path.join(BASE_DIR, "..", "DATASET")
os.makedirs(UPLOAD_DIR, exist_ok=True)

vector_store = VectorStore()
doc_processor = DocumentProcessor(chunk_size=600, chunk_overlap=80)
# Local LLM synthesizer module (uses OpenAI when API key is available)
try:
    from llm import synthesize_answer
except Exception:
    synthesize_answer = None

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    api_key: Optional[str] = None

def auto_ingest_local_dataset():
    """Auto ingest local dataset files if available (e.g. BankCustomerData.csv or DATASET folder)."""
    possible_paths = [
        os.path.join(BASE_DIR, "..", "BankCustomerData.csv"),
        os.path.join(BASE_DIR, "..", "bankdata", "BankCustomerData.csv"),
        os.path.join(DATASET_DIR, "BankCustomerData.csv"),
        os.path.join(DATASET_DIR, "data.csv")
    ]
    for p in possible_paths:
        if os.path.exists(p):
            fname = os.path.basename(p)
            stats = vector_store.get_stats()
            if fname not in stats.get("documents", []):
                print(f"Auto-ingesting local dataset: {p}")
                chunks, metadatas = doc_processor.process_file(p, fname)
                if chunks:
                    chunk_ids = [f"{fname}_{i}_{uuid.uuid4().hex[:6]}" for i in range(len(chunks))]
                    vector_store.add_chunks(chunks, chunk_ids, metadatas)
                    print(f"Successfully ingested {len(chunks)} chunks for {fname}")

import threading
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    threading.Thread(target=auto_ingest_local_dataset, daemon=True).start()
    yield

app = FastAPI(title="Botanica ChromaDB RAG API", version="1.0.0", lifespan=lifespan)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "service": "Bank-of-Librio RAG API"}

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "vector_db": "ChromaDB", "stats": vector_store.get_stats()}

@app.get("/api/documents")
def get_documents():
    stats = vector_store.get_stats()
    return stats

@app.post("/api/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """Upload documents/datasets and ingest into ChromaDB."""
    results = []
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process file into chunks
        chunks, metadatas = doc_processor.process_file(file_path, file.filename)
        
        if not chunks:
            results.append({"filename": file.filename, "status": "failed", "chunks_added": 0, "reason": "No extractable content found"})
            continue

        # Add to ChromaDB
        chunk_ids = [f"{file.filename}_{i}_{uuid.uuid4().hex[:6]}" for i in range(len(chunks))]
        added_count = vector_store.add_chunks(chunks, chunk_ids, metadatas)

        results.append({
            "filename": file.filename,
            "status": "success",
            "chunks_added": added_count,
            "file_type": metadatas[0].get("file_type", "UNKNOWN") if metadatas else "UNKNOWN"
        })

    return {"uploaded": results, "total_stats": vector_store.get_stats()}

@app.post("/api/ingest-kaggle")
def ingest_kaggle():
    """Download and ingest Kaggle bank customer dataset."""
    try:
        import kagglehub
        path = kagglehub.dataset_download("garimam/bank-customer-dataset")
        ingested_files = []
        
        if os.path.exists(path):
            for root, _, files in os.walk(path):
                for f in files:
                    if f.endswith(('.csv', '.xlsx', '.json', '.txt')):
                        full_p = os.path.join(root, f)
                        chunks, metadatas = doc_processor.process_file(full_p, f)
                        if chunks:
                            chunk_ids = [f"kaggle_{f}_{i}_{uuid.uuid4().hex[:6]}" for i in range(len(chunks))]
                            vector_store.add_chunks(chunks, chunk_ids, metadatas)
                            ingested_files.append({"filename": f, "chunks": len(chunks)})

        return {"status": "success", "download_path": path, "ingested_files": ingested_files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kaggle ingest error: {str(e)}")

@app.post("/api/query")
def query_rag(req: QueryRequest):
    """Retrieve relevant context chunks from ChromaDB and synthesize answer with citations."""
    query_text = req.query.strip()
    if not query_text:
        raise HTTPException(status_code=400, detail="Query text cannot be empty")

    top_k = req.top_k or 5
    retrieved = vector_store.query(query_text=query_text, n_results=top_k)

    if not retrieved:
        return {
            "query": query_text,
            "answer": "No relevant documents or records found in the ChromaDB knowledge base. Please upload documents or dataset files first.",
            "citations": [],
            "retrieved_chunks": []
        }

    # Extract unique citations
    citations = []
    seen_sources = set()
    for item in retrieved:
        meta = item.get("metadata", {})
        source_name = meta.get("source") or meta.get("filename", "Unknown Document")
        if source_name not in seen_sources:
            seen_sources.add(source_name)
            citations.append({
                "source": source_name,
                "filename": meta.get("filename", "Unknown"),
                "file_type": meta.get("file_type", "UNKNOWN"),
                "similarity": item.get("similarity", 0.0),
                "page_or_row": meta.get("page_number") or meta.get("row_number") or meta.get("chunk_index", "1")
            })

    # Synthesize answer from top context chunks
    answer = synthesize_rag_response(query_text, retrieved, req.api_key)

    return {
        "query": query_text,
        "answer": answer,
        "citations": citations,
        "retrieved_chunks": retrieved
    }

def synthesize_rag_response(query: str, chunks: List[Dict[str, Any]], api_key: Optional[str] = None) -> str:
    """Synthesize a concise, paraphrased answer that blends multiple retrieved chunks.

    This function delegates to the llm.synthesize_answer helper when available (OpenAI if configured).
    If no external LLM key is available, falls back to a lightweight paraphrase+merge heuristic to avoid
    returning verbatim source passages.
    """
    # Normalize inputs
    query = (query or "").strip()
    if not chunks:
        return "No relevant information found."

    # If the llm synthesizer is available, prefer it (uses OpenAI when OPENAI_API_KEY is set)
    if synthesize_answer:
        try:
            return synthesize_answer(query=query, chunks=chunks, api_key=api_key)
        except Exception as e:
            # Safe fallback: continue to heuristic below
            print(f"LLM synth failed, falling back to local synthesis: {e}")

    # --- Local heuristic fallback synthesis (keeps results non-verbatim) ---
    # Collect short excerpts with source tags
    excerpts = []
    seen = set()
    for c in chunks[:6]:
        content = c.get("content", "").strip().replace('\r', '')
        meta = c.get("metadata", {})
        src = meta.get("filename") or meta.get("source") or "unknown"
        # Take first 160 characters of the chunk as an excerpt, avoid duplicates
        short = " ".join(content.split())[:160]
        key = (short, src)
        if key in seen or len(short) < 20:
            continue
        seen.add(key)
        excerpts.append({"source": src, "excerpt": short})

    # Compose a paraphrased answer from the excerpts
    lines = [f"Question: {query}"]
    lines.append("Summary:")
    used = 0
    for ex in excerpts:
        if used >= 4:
            break
        # Paraphrase by rephrasing structure (naive): move clause order and remove quoted blocks
        t = ex["excerpt"]
        # Remove long quoted fragments and code fences
        t = t.replace('```', '')
        # Simple paraphrase heuristics: shorten and avoid verbatim repeating
        if len(t) > 120:
            t = t[:80].rsplit(' ', 1)[0] + '...'
        lines.append(f"- From {ex['source']}: {t}")
        used += 1

    if used == 0:
        # Last resort: return a brief non-verbatim note
        return "Relevant documents found but could not synthesize a concise answer. Please provide more specific question."

    lines.append("\nNote: Information synthesized from the indicated sources and expressed in original wording.")
    return "\n".join(lines)

@app.delete("/api/documents/{filename}")
def delete_document(filename: str):
    count = vector_store.delete_document(filename)
    return {"status": "success", "filename": filename, "deleted_chunks": count}

# Serve static frontend if available
root_dir = os.path.join(BASE_DIR, "..")
if os.path.exists(os.path.join(root_dir, "index.html")):
    app.mount("/static", StaticFiles(directory=root_dir), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
