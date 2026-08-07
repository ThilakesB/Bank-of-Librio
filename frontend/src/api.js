const API_BASE = "/api";

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  return res.json();
}

export async function uploadFiles(formData) {
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function ingestKaggle() {
  const res = await fetch(`${API_BASE}/ingest-kaggle`, {
    method: "POST",
  });
  return res.json();
}

export async function queryRAG(query, topK = 5) {
  const res = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  });
  return res.json();
}

export async function deleteDocument(filename) {
  const res = await fetch(
    `${API_BASE}/documents/${encodeURIComponent(filename)}`,
    { method: "DELETE" }
  );
  return res.json();
}
