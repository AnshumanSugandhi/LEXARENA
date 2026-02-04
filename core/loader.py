import json

def load_sections(path: str):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {item["section"]: item for item in data}
