const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "") + "/api";

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

export async function queryRAG(query, topK = 5, apiKey = "") {
  const res = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK, api_key: apiKey }),
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
