from core.semantic_search import semantic_search
from core.explain import explain_section


chat_history = []


def chat_answer(query: str):
    global chat_history

    chat_history.append({"role": "user", "text": query})

    results = semantic_search(query, k=3)

    response = []
    response.append(f"## Answer: {query}\n")

    for r in results:
        explanation = explain_section(r)
        response.append(
            f"### Section {r['section']} — {r['title']}\n{explanation}\n"
        )

    final = "\n".join(response)

    chat_history.append({"role": "assistant", "text": final})

    return {
        "answer": final,
        "memory": chat_history[-6:]  # last 3 exchanges
    }

