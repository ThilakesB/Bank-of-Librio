<img src="./assets/bank-of-librio-banner.png" alt="Bank of Librio" width="100%" style="border-radius:8px;" />

<div align="center">

# Bank of Libreo — Intelligent Banking RAG System

**An enterprise-grade Retrieval-Augmented Generation (RAG) system for bank data analysis, document intelligence, and AI-powered query answering.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-FF6B35?style=for-the-badge)](https://www.trychroma.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

</div>

---

## 🖥️ Live Preview

<p align="center">
  <img src="./docs/app-screenshot.png"
       alt="Bank of Libreo — Oracle Chat UI"
       width="100%" />
</p>

*The Oracle of Libreo — RAG-powered chat interface connected to ChromaDB vector store*

---

## 📐 System Architecture & Flow

```mermaid
flowchart TD
    subgraph Frontend["🖥️ Frontend (React + Vite)"]
        UI["User Interface"]
        APIClient["API Service Layer"]
        UI --> APIClient
    end

    subgraph Backend["⚡ FastAPI Server"]
        API["FastAPI App"]
        DocProc["Document Processor"]
        RAGEngine["RAG Search & Synthesis"]
    end

    subgraph Database["🗄️ ChromaDB Vector Store"]
        Embeddings["Sentence Transformers"]
        VectorDB["Chroma Vector Database"]
    end

    APIClient -->|"1. User Query / Upload"| API
    API -->|"2. Document Ingestion"| DocProc
    DocProc -->|"3. Text Chunks & Metadata"| Embeddings
    Embeddings -->|"4. Index Vectors"| VectorDB
    API -->|"5. Search Query"| RAGEngine
    RAGEngine -->|"6. Similarity Search"| VectorDB
    VectorDB -->|"7. Top-K Context"| RAGEngine
    RAGEngine -->|"8. Synthesized Answer"| API
    API -->|"9. JSON Response"| APIClient
```

<details>
<summary>📊 <strong>View Full Architecture Diagram</strong></summary>
<br/>

![System Flow Diagram](./System%20design/flow%20diagaram.webp)

</details>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Multi-Format Ingestion** | PDF, CSV, Excel `.xlsx`, Word `.docx`, TXT, Markdown, JSON, HTML |
| 🔍 **Semantic Vector Search** | ChromaDB + Sentence Transformers for semantically accurate retrieval |
| 🤖 **AI Answer Synthesis** | Blended, paraphrased answers with cited sources |
| ⚡ **Auto Dataset Loading** | Background ingestion of banking datasets on server startup |
| 🧩 **Chunk Inspector** | Drill down into retrieved context chunks per answer |
| 🎨 **Premium UI** | Classical-themed chat interface with glassmorphism & dark palette |
| ☁️ **Render Ready** | One-click deployment to Render (backend + frontend) |

---

## 🛠️ Technology Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Backend API** | Python 3, FastAPI, Uvicorn |
| **Vector Store** | ChromaDB, Sentence Transformers |
| **Document Parsing** | PyPDF2, Pandas, OpenPyXL, Python-Docx |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 |
| **Deployment** | Render (Web Service + Static Site) |

</div>

---

## 🚀 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root health check |
| `GET` | `/healthz` | Platform health monitoring |
| `GET` | `/api/health` | Vector store health & document statistics |
| `GET` | `/api/documents` | List all indexed documents |
| `POST` | `/api/upload` | Upload & auto-chunk document files |
| `POST` | `/api/query` | RAG query → synthesized answer + citations |
| `POST` | `/api/ingest-kaggle` | Auto-download Kaggle bank dataset |
| `DELETE` | `/api/documents/{filename}` | Remove a document from vector store |

---

## 💻 Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+

### ⚡ Quick Start (One Command)

```powershell
# From repo root — launches both servers in separate windows
.\start_dev.ps1
```

### Manual Setup

**Terminal 1 — Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
> Backend runs at `http://localhost:8000`

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`

> **Note:** Vite takes ~25s on first start while bundling dependencies. Wait for the `VITE ready` message.

---

## ☁️ Deployment Guide (Render)

<details>
<summary>🔧 <strong>Backend Service (Web Service)</strong></summary>

| Setting | Value |
|---|---|
| Environment | Python 3 |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app:app --host 0.0.0.0 --port $PORT` |

</details>

<details>
<summary>🌐 <strong>Frontend Service (Static Site)</strong></summary>

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Environment Variable | `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com` |

</details>

---

<div align="center">

Built with ⚡ by **Bank of Librio** — *Banking with Strength. Built on Trust.*

</div>
