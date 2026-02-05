from fastapi import APIRouter
from core.semantic_search import semantic_search
from core.explain import explain_section
from core.loader import load_sections

router = APIRouter()

sections = load_sections("data/processed/bns_sections.json")

@router.post("/chat")
def chat(query: str):
    results = semantic_search(query)

    if not results:
        return {"answer": "No relevant section found."}

    top = results[0]
    section_id = top["section"]

    section_data = sections.get(section_id)

    explanation = explain_section(section_data)

    return {
        "answer": explanation,
        "top_section": top,
        "all_results": results
    }
