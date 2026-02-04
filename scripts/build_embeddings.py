import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"

with open("data/processed/bns_sections.json", "r", encoding="utf-8") as f:
    sections = json.load(f)

texts = [
    f"Section {s['section']} {s['title']} {s['text']}"
    for s in sections
]

model = SentenceTransformer(MODEL_NAME)
embeddings = model.encode(texts, show_progress_bar=True)

dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings).astype("float32"))

faiss.write_index(index, "data/processed/bns_faiss.index")

with open("data/processed/section_lookup.json", "w", encoding="utf-8") as f:
    json.dump(sections, f, indent=2)

print("✅ FAISS index built successfully")
