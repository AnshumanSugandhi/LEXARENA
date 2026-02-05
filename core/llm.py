import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "deepseek-r1:1.5b"


def ask_llm(prompt: str) -> str:
    """
    Sends prompt to local DeepSeek model running via Ollama.
    """

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()
    return data["response"]
