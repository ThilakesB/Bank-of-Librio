"""Demo script to show before/after synthesis behavior.

This script builds a small set of fake retrieved chunks and runs two synthesizers:
- old_synthesize(): mimics original app behavior (returns verbatim-like content)
- new_synthesize(): calls the improved llm.synthesize_answer which paraphrases/blends

Run: python tests\rag_demo.py
"""

import sys
import os
# Ensure repository root is on sys.path so backend package can be imported
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from backend.llm import synthesize_answer

# Old-style verbatim synthesizer (copied/mimics previous app.py behavior)
def old_synthesize(query, chunks):
    top_chunk = chunks[0]
    top_meta = top_chunk.get("metadata", {})
    top_source = top_meta.get("source") or top_meta.get("filename", "retrieved knowledge base")
    # If tabular data chunk
    if "Record #" in top_chunk["content"] or "Source Table:" in top_chunk["content"]:
        summary_lines = [f"Based on **{top_source}** stored in ChromaDB, here are the matching record details:\n"]
        for idx, item in enumerate(chunks[:3], start=1):
            content = item["content"]
            similarity_pct = int(item.get("similarity", 0.0) * 100)
            summary_lines.append(f"**Match #{idx}** (Relevance: {similarity_pct}%):\n```text\n{content}\n```\n")
        return "\n".join(summary_lines)

    synthesis = [
        f"Based on the most relevant information retrieved from **{top_source}** (ChromaDB similarity: {int(top_chunk.get('similarity', 0.0)*100)}%):\n"
    ]
    key_points = []
    for c in chunks[:4]:
        raw_text = c["content"].strip()
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        for line in lines:
            if len(line) > 20 and line not in key_points:
                key_points.append(line)
                if len(key_points) >= 4:
                    break

    for point in key_points:
        synthesis.append(f"- {point}")

    return "\n\n".join(synthesis)


# Sample chunks (these simulate retrieved chunks that previously were echoed verbatim)
sample_chunks = [
    {"content": "Our bank offers a 3.5% interest rate on savings accounts for balances over $5000. Customers must maintain a monthly minimum balance.", "metadata": {"filename": "bank_terms.txt"}, "similarity": 0.92},
    {"content": "Checking accounts are free for the first year. Fees apply thereafter unless the account balance stays above $2000.", "metadata": {"filename": "fees_and_terms.txt"}, "similarity": 0.88},
    {"content": "Early withdrawal from fixed deposits incurs a penalty of 1.5% of the withdrawn amount.", "metadata": {"filename": "fd_policies.txt"}, "similarity": 0.85}
]

query = "What are the interest rates and notable fees I should know about for savings and checking accounts?"

print("--- OLD SYNTHESIS (verbatim-style) ---")
print(old_synthesize(query, sample_chunks))

print("\n--- NEW SYNTHESIS (improved paraphrase + blend) ---")
print(synthesize_answer(query, sample_chunks))
