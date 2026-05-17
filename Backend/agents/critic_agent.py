# agents/critic_agent.py
from typing import Dict, List
import textstat

CTA_VERBS = ["buy", "shop", "order", "learn", "get", "discover"]

PLATFORM_CONSTRAINTS = {
    "Google Search Ads": {"headline": 30, "description": 90},
    "Meta Ads": {"headline": 40, "description": 125},
}

def critique_ads(
    ads: Dict[str, Dict[str, List[str]]],
    top_keywords: List[str],
    score_threshold: int = 70
) -> Dict[str, Dict]:
    """
    Evaluate ads quality.
    
    Returns:
        dict: {platform: {"quality_score": int, "issues": List[str], "flag_regeneration": bool}}
    """
    results = {}

    for platform, ad_content in ads.items():
        issues = []
        score = 100  # start perfect

        # Check readability
        all_text = " ".join(ad_content.get("headlines", []) + ad_content.get("descriptions", []))
        readability = textstat.flesch_reading_ease(all_text)
        if readability < 50:  # threshold for readability
            issues.append(f"Low readability: {readability:.1f}")
            score -= 15

        # Check CTA presence
        cta_found = any(any(verb in text.lower() for verb in CTA_VERBS)
                        for text in ad_content.get("headlines", []) + ad_content.get("descriptions", []))
        if not cta_found:
            issues.append("Missing CTA verbs")
            score -= 20

        # Keyword coverage
        keyword_hits = sum(any(kw.lower() in text.lower() for text in ad_content.get("headlines", []) + ad_content.get("descriptions", []))
                           for kw in top_keywords)
        coverage_ratio = keyword_hits / max(len(top_keywords), 1)
        if coverage_ratio < 0.5:
            issues.append(f"Low keyword coverage: {keyword_hits}/{len(top_keywords)}")
            score -= 15

        # Platform length constraints
        constraints = PLATFORM_CONSTRAINTS.get(platform, {})
        for h in ad_content.get("headlines", []):
            if len(h) > constraints.get("headline", 1000):
                issues.append(f"Headline too long ({len(h)} chars)")
                score -= 10
        for d in ad_content.get("descriptions", []):
            if len(d) > constraints.get("description", 1000):
                issues.append(f"Description too long ({len(d)} chars)")
                score -= 10

        score = max(min(score, 100), 0)  # clamp 0-100
        flag_regeneration = score < score_threshold

        results[platform] = {
            "quality_score": score,
            "issues": issues,
            "flag_regeneration": flag_regeneration
        }

    return results
