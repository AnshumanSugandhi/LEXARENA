import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer


class SemanticEngine:
    def __init__(self, json_path: str):
        # Load sections
        with open(json_path, "r", encoding="utf-8") as f:
            self.sections = json.load(f)

        # Load embedding model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        # Build embeddings
        texts = [
            f"Section {s['section']} {s['title']} {s['text']}"
            for s in self.sections
        ]

        embeddings = self.model.encode(texts)

        # Build FAISS index
        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(np.array(embeddings).astype("float32"))

    def search(self, query: str, k=5):
        q_emb = self.model.encode([query])
        D, I = self.index.search(np.array(q_emb).astype("float32"), k)

        results = []
        for idx in I[0]:
            results.append(self.sections[idx])

        return results
