import faiss
import json
import numpy as np
import os
from sentence_transformers import SentenceTransformer

class SemanticEngine:
    def __init__(self, json_path: str):
        # Load sections
        with open(json_path, "r", encoding="utf-8") as f:
            self.sections = json.load(f)

        # Load embedding model
        # (This is still needed to encode the search query)
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        # Define path to the pre-built index
        # We assume it lives in the same folder as the json
        index_path = json_path.replace("bns_sections.json", "bns_faiss.index")
        
        # Load the index if it exists
        if os.path.exists(index_path):
            print(f"Loading pre-built index from {index_path}...")
            self.index = faiss.read_index(index_path)
        else:
            # Fallback: Build it if missing (Only for local dev, will likely timeout on prod)
            print("⚠️ Index not found! Building from scratch (this may be slow)...")
            texts = [
                f"Section {s['section']} {s['title']} {s['text']}"
                for s in self.sections
            ]
            embeddings = self.model.encode(texts)
            dim = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dim)
            self.index.add(np.array(embeddings).astype("float32"))

    def search(self, query: str, k=5):
        q_emb = self.model.encode([query])
        D, I = self.index.search(np.array(q_emb).astype("float32"), k)

        results = []
        for idx in I[0]:
            if idx < len(self.sections):
                results.append(self.sections[idx])

        return results