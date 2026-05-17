
import os
import json
import re
import time
import requests
from typing import List, Dict

# =========================
# OpenRouter Configuration
# =========================
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
    # Optional but recommended by OpenRouter
    "HTTP-Referer": "http://localhost",
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
    




def safe_json_load(text: str) -> dict:
    text = re.sub(r"```json|```", "", text, flags=re.IGNORECASE)
    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if match:
        json_text = match.group(0)
        json_text = re.sub(r",\s*(\}|])", r"\1", json_text)
        json_text = json_text.replace("\n", " ").strip()
        try:
            return json.loads(json_text)
        except json.JSONDecodeError as e:
            print("[OpenRouter] JSON parsing error:", e)
            print("[OpenRouter] Bad JSON:", json_text)
    return {}





def generate_ad(
    caption: str,
    attributes: Dict[str, str],
    keywords: List[str],
    platforms: List[str] = ["Meta Ads"],
    tone: str = "persuasive, concise"
) -> Dict[str, Dict[str, List[str]]]:

    all_ads = {}

    for platform in platforms:
        prompt = f"""
Product: {caption}
Top features: {json.dumps(attributes)}
Keywords: {', '.join(keywords)}
Platform: {platform}

Rules:
- Headline <= 30 characters
- Description <= 90 characters
- Tone: {tone}

Return STRICT JSON ONLY:
{{
  "headlines": [],
  "descriptions": [],
  "final_keyword_usage": []
}}
"""

        text = call_openrouter_model(prompt)
        ad_output = safe_json_load(text)

        for key in ["headlines", "descriptions", "final_keyword_usage"]:
            ad_output.setdefault(key, [])

        all_ads[platform] = ad_output

        # Rate-limit safety
        time.sleep(1.2)

    return all_ads
