from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import core functionalities
from core.loader import load_sections
from core.search import search_section
from core.explain import explain_section
from core.chat import chat_answer 
from core.semantic_search import semantic_search  # <--- Import this to reuse the engine
from core.chat_agent import chat_answer


app = FastAPI(title="LexArena API")

# 1. Load Data (Keep this global so it loads once)
sections = load_sections("data/processed/bns_sections.json")

# 2. CORS (Allow all origins to fix frontend connection issues)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class ChatRequest(BaseModel):
    query: str

# --- Endpoints ---

@app.get("/")
def root():
    return {"status": "LexArena running"}

@app.get("/search")
def keyword_search_endpoint(q: str):
    """Exact keyword search (e.g. searching for '302')"""
    result = search_section(q, sections)
    if not result:
        return {"error": "Section not found"}
    return result

@app.get("/semantic-search")
def semantic_search_endpoint(q: str):
    """
    AI Search: Uses the shared semantic_search function
    to avoid loading the model twice.
    """
    # Use the helper function instead of a local engine instance
    results = semantic_search(q, k=5)
    
    # Format for the frontend list view
    return [
        {
            "section": r["section"],
            "title": r["title"],
            "preview": r["text"][:200] + "...",
        }
        for r in results
    ]

@app.get("/explain/{section_id}")
def explain_endpoint(section_id: str):
    """Returns simplified explanation"""
    section = sections.get(section_id)
    if not section:
        # Fallback: Try to find it in the semantic search results if not in direct lookup
        return {"error": "Section not found"}
    return {"explanation": explain_section(section)}

@app.post("/chat")
def chat(payload: dict):
    query = payload.get("query")

    if not query:
        return {"answer": "Please ask something valid."}

    return chat_answer(query)

@app.post("/chat")
def chat_endpoint(payload: ChatRequest):
    """
    Chat endpoint for the RAG UI.
    Uses core/chat.py logic.
    """
    if not payload.query:
        raise HTTPException(status_code=400, detail="Query is required")

    # This calls your RAG logic in core/chat.py
    return chat_answer(payload.query)