import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer
import os
from .semantic_engine import SemanticEngine

# Initialize the engine once (Singleton pattern)
# Ensure the path is correct relative to your project root
json_path = os.path.join("data", "processed", "bns_sections.json")
engine = SemanticEngine(json_path)

def semantic_search(query: str, k: int = 5):
    """
    Wrapper function that calls the instantiated engine.
    """
    return engine.search(query, k=k)
