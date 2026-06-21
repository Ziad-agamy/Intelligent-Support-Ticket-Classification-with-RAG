# Customer Support Ticket System

An intelligent, AI-powered customer support ticket system that automates query handling using a Retrieval-Augmented Generation (RAG) pipeline. Users submit support tickets through a web form, and the system classifies their query, retrieves relevant information from a knowledge base, and generates a contextual AI response in real time.

---

## How It Works

1. **User submits a ticket** via the React frontend (name, email, phone, question).
2. **SVM classifier** categorizes the question (e.g. billing, technical support, account).
3. **Hybrid retriever** searches a knowledge base using Pinecone (vector similarity 0.7 weight) + BM25 (keyword 0.3 weight) with per-category BM25 indices.
4. **Cohere reranker** compresses and re-ranks the top retrieved documents.
5. **Groq LLM** (Llama 3.3 70B) generates a grounded, human-readable response based strictly on the retrieved context.
6. Ticket and AI response are persisted to PostgreSQL.
7. The user sees the response rendered as Markdown on a thank-you page.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.9+, FastAPI, Uvicorn |
| **Frontend** | React 18, Vite, React Router, react-markdown |
| **Database** | PostgreSQL 16, SQLAlchemy (async) |
| **Vector Store** | Pinecone (Cosine similarity) |
| **Keyword Search** | BM25 (rank_bm25) |
| **Embeddings** | Ollama — `qwen3-embedding:0.6b` |
| **Reranking** | Cohere — `rerank-english-v3.0` |
| **LLM** | Groq — `llama-3.3-70b-versatile` |
| **Classifier** | Scikit-learn SVM + TF-IDF |
| **LangChain** | langchain, langchain-core, langchain-community, langchain-cohere, langchain-groq, langchain-ollama, langchain-pinecone |

---

## Project Structure

```
├── backend/                           # FastAPI backend
│   ├── app/
│   │   ├── main.py                    # App entrypoint, CORS, lifespan
│   │   ├── config.py                  # Pydantic settings, model factories
│   │   ├── api/
│   │   │   └── routes.py              # POST /support/submit
│   │   ├── core/
│   │   │   └── pipeline.py            # Classify → Retrieve → Generate
│   │   ├── classifier/
│   │   │   ├── model.py               # SVM + TF-IDF wrapper
│   │   │   ├── svm_model.pkl          # Pre-trained classifier
│   │   │   └── tfidf.pkl              # Pre-trained vectorizer
│   │   ├── rag/
│   │   │   ├── retriever.py           # Pinecone + per-category BM25 + Cohere rerank
│   │   │   └── generator.py           # Prompt loading + LLM invocation
│   │   ├── database/
│   │   │   ├── base.py                # SQLAlchemy DeclarativeBase
│   │   │   ├── session.py             # Async engine + session factory
│   │   │   └── models/
│   │   │       ├── user.py            # User table (name, email, phone)
│   │   │       └── query.py           # Query table (question, response, timestamp)
│   │   ├── repositories/
│   │   │   └── support_repository.py  # get_or_create_user, save_query
│   │   ├── schemas/
│   │   │   └── support.py             # Pydantic: SupportFormInput, SupportResponse
│   │   └── prompts/
│   │       └── generator_prompt.md    # LLM system prompt
│   ├── scripts/
│   │   ├── ingest_knowledge.py        # CSV → Pinecone + rag_artifacts/ builder
│   │   └── M1_2.ipynb                 # Data exploration notebook
│   ├── data/
│   │   ├── clean.csv                  # Cleaned knowledge base
│   │   ├── raw.csv
│   │   ├── cleaning.ipynb
│   │   └── analysis/                  # EDA charts
│   ├── evaluation/                    # Stubs (no test framework)
│   │   ├── evaluate.py
│   │   ├── test_queries.json
│   │   └── results/
│   ├── rag_artifacts/                 # Local BM25 cache (gitignored)
│   │   ├── knowledge_corpus.pkl       # Raw chunked documents
│   │   └── bm25_by_type.pkl           # Per-category BM25 retrievers + __all__
│   ├── requirements.txt
│   ├── .env                           # API keys + DB credentials (gitignored)
│   └── .env.example                   # Template for .env
├── frontend/                          # React SPA
│   ├── src/
│   │   ├── main.jsx                   # React entry, BrowserRouter
│   │   ├── App.jsx                    # Support form component
│   │   ├── pages/
│   │   │   ├── ThankYou.jsx           # Response display (Markdown)
│   │   │   └── ThankYou.css
│   │   ├── Form.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js                 # Dev proxy: /api, /support → :8000
│   └── package.json
├── .gitignore
├── AGENTS.md
├── README.md
└── skills-lock.json
```

---

## Prerequisites

### Required Running Services

| Service | Details |
|---|---|
| PostgreSQL | Running on the host/port configured in `backend/.env` |
| Ollama | Model `qwen3-embedding:0.6b` pulled and accessible |
| Groq | API key in `backend/.env` — `GROQ_API_KEY` |
| Cohere | API key in `backend/.env` — `COHERE_API_KEY` |
| Pinecone | API key in `backend/.env` — `PINECONE_API_KEY`, pre-created index — `PINECONE_INDEX_NAME` |

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

| Variable | Description |
|---|---|
| `COHERE_API_KEY` | Cohere API key for reranking |
| `GROQ_API_KEY` | Groq API key for LLM inference |
| `PINECONE_API_KEY` | Pinecone API key for vector store |
| `PINECONE_INDEX_NAME` | Pinecone index name (e.g. `chat-ticket`) |
| `OLLAMA_BASE_URL` | Ollama server URL (default: `http://localhost:11434`) |
| `PGHOST` | PostgreSQL host |
| `PGPORT` | PostgreSQL port (default: `5432`) |
| `PGDATABASE` | PostgreSQL database name |
| `PGUSER` | PostgreSQL user |
| `PGPASSWORD` | PostgreSQL password |

---

## Quick Start

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend starts at `http://localhost:8000`. Tables are auto-created on first startup.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:3000` and proxies `/api` and `/support` requests to the backend.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/support/submit` | Submit support ticket |

### POST /support/submit

```json
// Request
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "question": "How do I reset my password?"
}

// Response
{
  "id": 1,
  "llm_response": "**Answer:** To reset your password...",
  "created_at": "2026-06-21T12:00:00Z"
}
```

---

## Data Ingestion

The Pinecone index is pre-built. To rebuild it from `backend/data/clean.csv`:

```powershell
cd backend
.\venv\Scripts\activate
python -c "from scripts.ingest_knowledge import Knowledge; Knowledge().ingest_knowledge()"
```

This also regenerates the BM25 artifacts in `backend/rag_artifacts/`.

---

## Notes

- Tables are auto-created on first startup via `Base.metadata.create_all`.
- The SVM classifier (`svm_model.pkl`, `tfidf.pkl`) and TF-IDF vectorizer are pre-trained and tracked in git.
- `backend/rag_artifacts/` must exist at startup (it's required for BM25). It's gitignored and can be regenerated via the ingestion script.
- If you encounter `ModuleNotFoundError: No module named 'langchain_classic'`, this is a known issue — the intended imports (`EnsembleRetriever`, `ContextualCompressionRetriever`) should come from `langchain.retrievers` or `langchain_community` rather than `langchain_classic`.
- No test framework, linter, or type checker is currently configured.
