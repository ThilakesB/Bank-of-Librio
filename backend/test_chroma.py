import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from document_processor import DocumentProcessor
from vector_store import VectorStore

def main():
    print("Testing ChromaDB RAG Vector Store & Document Processor...")
    
    dp = DocumentProcessor(chunk_size=500, chunk_overlap=50)
    vs = VectorStore(collection_name="test_collection")
    
    # 1. Test sample text chunking
    sample_text = "Botanica AI is an intelligent assistant utilizing ChromaDB vector search for natural language queries."
    chunks = dp._chunk_text_string(sample_text)
    print(f"Sample text chunked into {len(chunks)} chunk(s).")
    
    # 2. Add sample chunks to ChromaDB
    vs.add_chunks(
        texts=chunks,
        ids=["test_chunk_1"],
        metadatas=[{"filename": "test.txt", "file_type": "TXT", "source": "test.txt"}]
    )
    print("Added test chunk to ChromaDB collection.")
    
    # 3. Query ChromaDB similarity
    results = vs.query("What vector database does Botanica AI use?", n_results=1)
    print(f"Query returned {len(results)} result(s).")
    if results:
        top = results[0]
        print(f"Top Result Content: '{top['content']}'")
        print(f"Metadata: {top['metadata']}")
        print(f"Similarity score: {top['similarity']}")
        
    print("ChromaDB Test Successful!")

if __name__ == "__main__":
    main()
