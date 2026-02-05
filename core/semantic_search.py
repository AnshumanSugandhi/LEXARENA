import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from . import semantic_engine 


model = SentenceTransformer("all-MiniLM-L6-v2")

index = faiss.read_index("data/processed/bns_faiss.index")

with open("data/processed/section_lookup.json", "r", encoding="utf-8") as f:
    sections = json.load(f)

def semantic_search(query: str, k: int = 5):
    results = semantic_engine.search(query, k=k)
    return results

