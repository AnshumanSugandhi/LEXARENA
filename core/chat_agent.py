from core.semantic_search import semantic_search
from core.llm import ask_llm


def chat_answer(query: str):
    """
    LexArena Local AI Agent:
    Query → Retrieve Sections → DeepSeek Reasoning → Final Answer
    """

    # 1. Retrieve top legal sections
    results = semantic_search(query, k=3)

    if not results:
        return {"answer": "❌ No relevant legal section found."}

    # 2. Build legal context
    context_blocks = []
    citations = []

    for r in results:
        citations.append(f"Section {r['section']} — {r['title']}")

        context_blocks.append(
            f"""
SECTION {r['section']} — {r['title']}
{r['text']}
"""
        )

    context = "\n---\n".join(context_blocks)

    # 3. Prompt DeepSeek like a law student assistant
    prompt = f"""
You are LexArena, an AI legal assistant for Indian law students.

Answer the question ONLY using the legal sections below.

Rules:
- Explain in simple law-student style
- Mention punishment if present
- Give multiple sections if relevant
- End with citations

USER QUESTION:
{query}

LEGAL CONTEXT:
{context}

Now write the best helpful answer:
"""

    answer = ask_llm(prompt)

    # 4. Append citations
    answer += "\n\n---\n### ✅ Citations\n"
    for c in citations:
        answer += f"- {c}\n"

    return {"answer": answer}
