from fastapi import FastAPI
from core.loader import load_sections
from core.search import search_section
from core.explain import explain_section
from core.semantic_engine import SemanticEngine
from fastapi.middleware.cors import CORSMiddleware
from api.routes.chat import router as chat_router


app = FastAPI(title="LexArena API")

sections = load_sections("data/processed/bns_sections.json")
semantic_engine = SemanticEngine("data/processed/bns_sections.json")
app.include_router(chat_router)
@app.get("/")
def root():
    return {"status": "LexArena running"}

@app.get("/search")
def search(q: str):
    result = search_section(q, sections)
    if not result:
        return {"error": "Section not found"}
    return result

@app.get("/explain/{section_id}")
def explain(section_id: str):
    section = sections.get(section_id)
    if not section:
        return {"error": "Section not found"}
    return {"explanation": explain_section(section)}


@app.get("/semantic-search")
def semantic(q: str):
    results = semantic_engine.search(q, k=5)

    return [
        {
            "section": r["section"],
            "title": r["title"],
            "preview": r["text"][:200] + "..."
        }
        for r in results
    ]

# In api/main.py

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",                 # Local development
#         "https://lexarena-eight.vercel.app",     # <--- YOUR FRONTEND
#         "https://lexarena-eight.vercel.app/"     # (Add this too, just to be safe)
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


