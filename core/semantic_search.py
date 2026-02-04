import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

index = faiss.read_index("data/processed/bns_faiss.index")

with open("data/processed/section_lookup.json", "r", encoding="utf-8") as f:
    sections = json.load(f)

def semantic_search(query: str, top_k: int = 3):
    query_embedding = model.encode([query])
    distances, indices = index.search(
        np.array(query_embedding).astype("float32"),
        top_k
    )
    return [sections[i] for i in indices[0]]
