from core.semantic_search import semantic_search
from core.llm import ask_llm

def chat_answer(query: str):

    # 1. Retrieve top sections
    results = semantic_search(query, k=3)

    if not results:
        return {"answer": "No relevant legal section found."}

    # 2. Build context for LLM
    context = ""
    for r in results:
        context += f"""
Section {r['section']} — {r['title']}
{r['text']}
---
"""

    # 3. Ask DeepSeek LLM
    prompt = f"""
You are LexArena, a law-student style AI assistant.

Answer the user question using ONLY the legal context below.
Explain simply, clearly, and mention punishments if present.
Always cite section numbers.

USER QUESTION:
{query}

LEGAL CONTEXT:
{context}

FINAL ANSWER:
"""

    answer = ask_llm(prompt)

    return {"answer": answer}
