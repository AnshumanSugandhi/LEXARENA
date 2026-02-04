import re

def explain_section(section: dict) -> str:
    title = section["title"]
    text = section["text"]

    explanation = []

    explanation.append(
        f"Section {section['section']} deals with {title.lower()}."
    )

    explanation.append(
        "\nEssential ingredients of the offence include:"
    )

    lines = text.split(",")
    for i, line in enumerate(lines[:4], start=1):
        explanation.append(f"{i}. {line.strip()}.")

    match = re.search(
        r"shall be punished with (.+?)(?:\.|$)", text, re.IGNORECASE
    )
    if match:
        explanation.append(
            f"\nPunishment: {match.group(1)}."
        )

    explanation.append(
        "\nThis section aims to protect public order and legal rights."
    )

    return "\n".join(explanation)
