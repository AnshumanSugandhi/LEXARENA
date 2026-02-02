import regex as re
from tqdm import tqdm

INPUT_FILE = "ipc_raw.txt"
OUTPUT_FILE = "ipc_sections.json"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    text = f.read()

# Normalize spacing
text = re.sub(r'\n+', '\n', text)
text = re.sub(r' +', ' ', text)

# IPC Section Pattern
pattern = re.compile(
    r'\n(?P<section>\d{1,3})\.\s+(?P<content>.*?)(?=\n\d{1,3}\.\s+)',
    re.S
)

sections = []

for match in tqdm(pattern.finditer(text)):
    section_id = match.group("section")
    content = match.group("content").strip()

    sections.append({
    "section_id": section_id,
    "law": "BNS_2023",
    "title": content.strip(),
    "body": ""
})


import json
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(sections, f, indent=2, ensure_ascii=False)

print(f"✅ Extracted {len(sections)} IPC sections into ipc_sections.json")
