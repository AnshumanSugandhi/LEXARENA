from core.semantic_search import semantic_search
from core.explain import explain_section

def chat_answer(query: str):
    """
    RAG Chat Answer:
    1. Searches for relevant sections (Semantic Search).
    2. Simplifies them (Explain).
    3. Combines them into a helpful chat response.
    """
    
    # 1. Search for top 3 relevant sections
    results = semantic_search(query, k=3)

    if not results:
        return {
            "answer": "I'm sorry, I couldn't find any specific sections in the Bhartiya Nyaya Sanhita (BNS) related to your query. Try rephrasing with specific legal terms."
        }

    response_text = []
    
    # 2. Build the main answer
    response_text.append(f"Here are the relevant sections for: **{query}**\n")

    for r in results:
        section_id = r["section"]
        title = r["title"]
        text = r["text"]

        # Get the simplified explanation
        explanation = explain_section({
            "section": section_id,
            "title": title,
            "text": text
        })

        # Append to the response
        response_text.append(f"### Section {section_id}: {title}")
        response_text.append(explanation)
        response_text.append("\n---\n")

    # 3. Add Citations at the bottom
    response_text.append("### 📚 Citations")
    for r in results:
        response_text.append(f"- **Section {r['section']}**: {r['title']}")

    return {
        "answer": "\n".join(response_text)
    }