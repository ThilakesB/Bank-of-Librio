import os
import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any, Optional

DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "chroma_db")

class VectorStore:
    def __init__(self, collection_name: str = "rag_knowledge_base"):
        os.makedirs(DB_DIR, exist_ok=True)
        self.client = chromadb.PersistentClient(path=DB_DIR)
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )

    def add_chunks(self, texts: List[str], ids: List[str], metadatas: List[Dict[str, Any]]) -> int:
        """Upsert text chunks into ChromaDB with metadata."""
        if not texts:
            return 0
        
        # Clean metadatas to ensure ChromaDB compatible scalar types
        cleaned_metadatas = []
        for meta in metadatas:
            cleaned = {}
            for k, v in meta.items():
                if isinstance(v, (str, int, float, bool)):
                    cleaned[k] = v
                elif v is None:
                    cleaned[k] = ""
                else:
                    cleaned[k] = str(v)
            cleaned_metadatas.append(cleaned)

        self.collection.upsert(
            documents=texts,
            ids=ids,
            metadatas=cleaned_metadatas
        )
        return len(texts)

    def query(self, query_text: str, n_results: int = 5, where_filter: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Query top-K similar chunks from ChromaDB."""
        kwargs = {
            "query_texts": [query_text],
            "n_results": min(n_results, max(1, self.collection.count())) if self.collection.count() > 0 else 1
        }
        if where_filter:
            kwargs["where"] = where_filter

        if self.collection.count() == 0:
            return []

        results = self.collection.query(**kwargs)
        
        output = []
        if results and results.get("documents"):
            docs = results["documents"][0]
            metas = results["metadatas"][0] if results.get("metadatas") else [{}] * len(docs)
            ids = results["ids"][0] if results.get("ids") else [""] * len(docs)
            distances = results["distances"][0] if results.get("distances") else [0.0] * len(docs)

            for doc, meta, doc_id, dist in zip(docs, metas, ids, distances):
                similarity = round(max(0.0, 1.0 - float(dist)), 4)
                output.append({
                    "id": doc_id,
                    "content": doc,
                    "metadata": meta,
                    "similarity": similarity
                })
        return output

    def get_stats(self) -> Dict[str, Any]:
        """Return dataset stats."""
        total_chunks = self.collection.count()
        all_meta = self.collection.get(include=["metadatas"]) if total_chunks > 0 else {"metadatas": []}
        
        filenames = set()
        file_types = set()
        for meta in all_meta.get("metadatas", []):
            if "filename" in meta:
                filenames.add(meta["filename"])
            if "file_type" in meta:
                file_types.add(meta["file_type"])
                
        return {
            "total_chunks": total_chunks,
            "document_count": len(filenames),
            "documents": sorted(list(filenames)),
            "supported_types": sorted(list(file_types))
        }

    def delete_document(self, filename: str) -> int:
        """Remove all chunks associated with a specific file."""
        if self.collection.count() == 0:
            return 0
        matching = self.collection.get(where={"filename": filename})
        if matching and matching.get("ids"):
            self.collection.delete(ids=matching["ids"])
            return len(matching["ids"])
        return 0

    def reset_collection(self):
        """Clear all data from collection."""
        if self.collection.count() > 0:
            all_data = self.collection.get()
            if all_data and all_data.get("ids"):
                self.collection.delete(ids=all_data["ids"])
