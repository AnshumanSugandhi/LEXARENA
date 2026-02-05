from core.semantic_search import semantic_search
from core.explain import explain_section


def chat_answer(query: str):
    """
    Full assistant pipeline:
    User Query → Semantic Search → Best Section → Explanation → ChatGPT style reply
    """

    results = semantic_search(query)

    if not results:
        return {
            "answer": "Sorry, I could not find any relevant legal section for your query."
        }

    # Take top result
    best = results[0]

    section_id = best["section"]
    title = best["title"]

    # Generate explanation
    explanation = explain_section({
        "section": section_id,
        "title": title,
        "text": best["text"]
    })

    # Final assistant response
    final_answer = f"""
📌 **Section {section_id} — {title}**

{explanation}

---

✅ *This answer is based on Bhartiya Nyaya Sanhita (BNS) official text.*
"""

    return {"answer": final_answer.strip()}
