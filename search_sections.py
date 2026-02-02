import json
import re
from typing import Optional, Dict


# -------------------------------
# 1. Load Sections
# -------------------------------
def load_sections(path: str) -> Dict[str, dict]:
    """
    Loads sections into a dict keyed by section number.
    """
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return {item["section"]: item for item in data}


# -------------------------------
# 2. Normalize User Query
# -------------------------------
def normalize_section_query(query: str) -> Optional[str]:
    """
    Normalizes user input to a section number.

    Examples:
    - 'Section 303'       -> '303'
    - 'sec 303 theft'     -> '303'
    - 'IPC 303'           -> '303'
    - 'What is 303?'      -> '303'
    """
    if not query:
        return None

    match = re.search(r"\b(\d{1,3})\b", query)
    return match.group(1) if match else None


# -------------------------------
# 3. Search Logic
# -------------------------------
def search_section(query: str, sections: Dict[str, dict]) -> Optional[dict]:
    """
    Returns the section dict if found, else None.
    """
    section_id = normalize_section_query(query)

    if not section_id:
        return None

    return sections.get(section_id)


# -------------------------------
# 4. CLI Test (Run directly)
# -------------------------------
if __name__ == "__main__":
    sections = load_sections("bns_sections.json")

    while True:
        user_input = input("\nSearch section (or 'exit'): ").strip()
        if user_input.lower() == "exit":
            break

        result = search_section(user_input, sections)

        if not result:
            print("❌ Section not found.")
            continue

        print("\n==============================")
        print(f"SECTION {result['section']}")
        print(f"TITLE   {result['title']}")
        print("------------------------------")
        print(result["text"])
        print("==============================")
