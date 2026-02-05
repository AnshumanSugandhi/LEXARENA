import re

def normalize_query(q: str):
    q = q.lower().strip()
    q = re.sub(r"section\s*", "", q)
    q = re.sub(r"[^a-z0-9\s]", "", q)
    return q
