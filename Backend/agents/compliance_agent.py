# agents/compliance_agent.py
from typing import Dict, List
import re

# Define rule sets
LANGUAGE_ISSUES = [r"!!!+", r"\?\?+", r"\bguaranteed\b", r"\bbest ever\b", r"click here\b"]
SEXUAL_ADULT = ["sexual", "nudity", "sex", "porn"]
PERSONAL_ATTRIBUTES = ["race", "ethnicity", "religion", "beliefs", "health", "sexual orientation", "political", "financial"]
DISCRIMINATORY = ["discrimination", "biased", "prejudice"]
PROHIBITED_PRODUCTS = ["adult products", "tobacco", "drugs", "weapon", "ammunition", "explosives", "prescription drugs", "unsafe supplements"]

def extended_compliance_check(ads: Dict[str, Dict[str, List[str]]]) -> Dict[str, Dict]:
    """
    Extended compliance check for ad content.
    
    Returns:
        dict: {platform: {"compliance_pass": bool, "flags": List[str]}}
    """
    results = {}

    for platform, ad_content in ads.items():
        flags = []
        all_text = " ".join(ad_content.get("headlines", []) + ad_content.get("descriptions", []))
        all_text_lower = all_text.lower()

        # 1. Language & Quality
        for pattern in LANGUAGE_ISSUES:
            if re.search(pattern, all_text_lower):
                flags.append(f"Language/quality issue detected: '{pattern}'")

        # 2. Sexual & Adult Content
        for term in SEXUAL_ADULT:
            if term in all_text_lower:
                flags.append(f"Sexual/adult content detected: {term}")

        # 3. Personal Attributes
        for term in PERSONAL_ATTRIBUTES:
            if term in all_text_lower:
                flags.append(f"Reference to personal attribute: {term}")

        # 4. Discrimination & Deception
        for term in DISCRIMINATORY:
            if term in all_text_lower:
                flags.append(f"Discriminatory/deceptive content detected: {term}")

        # 5. Prohibited Products & Services
        for term in PROHIBITED_PRODUCTS:
            if term in all_text_lower:
                flags.append(f"Prohibited product/service mentioned: {term}")

        compliance_pass = len(flags) == 0

        results[platform] = {
            "compliance_pass": compliance_pass,
            "flags": flags
        }

    return results
