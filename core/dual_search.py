from core.semantic_engine import BNSSemanticEngine, IPCSemanticEngine


bns_engine = BNSSemanticEngine()
ipc_engine = IPCSemanticEngine()


def dual_search(query: str):
    bns_results = bns_engine.search(query, k=3)
    ipc_results = ipc_engine.search(query, k=3)

    return {
        "bns": bns_results,
        "ipc": ipc_results
    }
