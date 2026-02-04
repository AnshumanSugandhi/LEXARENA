import re
from typing import Optional

def normalize_section_query(query: str) -> Optional[str]:
    match = re.search(r"\b(\d{1,3})\b", query)
    return match.group(1) if match else None
