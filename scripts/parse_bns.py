import re
from typing import Dict

def parse_bns_sections(raw_text: str) -> Dict[str, dict]:
    sections = {}

    text = raw_text.replace('\r\n', '\n')

    pattern = re.compile(
        r'\n(?P<section>\d{1,3})\.\s*'
        r'(?P<title>[^—]+)—'
        r'(?P<body>.*?)(?=\n\d{1,3}\.\s|\Z)',
        re.DOTALL
    )

    for match in pattern.finditer(text):
        section_no = match.group('section').strip()
        title = match.group('title').strip()
        body = match.group('body').strip()

        sections[section_no] = {
            "section": section_no,
            "title": title,
            "text": body
        }

    return sections


with open("bns_raw.txt", "r", encoding="utf-8") as f:
    raw_text = f.read()

sections = parse_bns_sections(raw_text)

print("TITLE:", sections["300"]["title"])
print("TEXT:", sections["300"]["text"][:300])
import json

with open("bns_raw.txt", "r", encoding="utf-8") as f:
    raw_text = f.read()

sections = parse_bns_sections(raw_text)

with open("bns_sections.json", "w", encoding="utf-8") as f:
    json.dump(
        list(sections.values()),
        f,
        indent=2,
        ensure_ascii=False
    )

print(f"✅ Exported {len(sections)} sections to bns_sections.json")
