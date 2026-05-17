



import os
import requests
import json

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost",  # required by OpenRouter
    "X-Title": "Ad Writer App"
}



def call_openrouter_model(
    prompt: str,
    model: str = "openai/gpt-4o-mini",
    max_tokens: int = 300,
    temperature: float = 0.7
) -> str:
    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=HEADERS,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()

        return data["choices"][0]["message"]["content"]

    except Exception as e:
        print("[OpenRouter] API call failed:", e)
        return ""
    



def extract_attributes(caption: str) -> dict:
    prompt = f"""
Extract product attributes from the caption.
Return STRICT JSON ONLY. If an attribute is not present, leave it as an empty string.

Schema:
{{
  "category": "",
  "brand": "",
  "color": "",
  "material": "",
  "gender": "",
  "style": ""
}}

Caption:
"{caption}"
"""
    try:
        if not OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY is missing")

        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=HEADERS,
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2
            },
            timeout=30
        )
        response.raise_for_status()

        data = response.json()
        content = data["choices"][0]["message"]["content"]
        content = content.replace("```json", "").replace("```", "").strip()

        attributes = json.loads(content)
        for key in ["category", "brand", "color", "material", "gender", "style"]:
            attributes.setdefault(key, "")

        return attributes

    except Exception as e:
        print("[Attribute Agent] Failed to extract attributes:", e)
        return {
            "category": "",
            "brand": "",
            "color": "",
            "material": "",
            "gender": "",
            "style": ""
        }
