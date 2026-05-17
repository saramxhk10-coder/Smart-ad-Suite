from typing import Dict



def build_google_payload(state):
    """
    Builds properly formatted Google Ads payload.
    """
    # Get ads data - handle both naming conventions
    ads_data = state.get("ads", {})
    google_ads = ads_data.get("google") or ads_data.get("Google Search Ads") or {}
    
    headlines = google_ads.get("headlines", [])
    descriptions = google_ads.get("descriptions", [])
    
    # Get keywords
    keywords = []
    final_keywords = state.get("final_keywords", {})
    if final_keywords:
        keywords = (
            final_keywords.get("primary", []) +
            final_keywords.get("secondary", [])[:5]
        )
    
    # Get campaign config
    cfg = state.get("campaign_config", {})
    
    # Extract budget
    budget_micros = (
        cfg.get("budget_micros") or 
        cfg.get("budget_cents", 0) * 10000 or
        1_000_000
    )
    
    campaign_name = cfg.get("campaign_name", "AI Generated Campaign")
    landing_url = cfg.get("landing_url", "https://example.com")
    
    # Validate we have minimum required data
    if not headlines:
        print("[Packager] WARNING: No headlines found, using fallback")
        headlines = ["Shop Now", "Limited Offer", "Buy Today"]
    
    if not descriptions:
        print("[Packager] WARNING: No descriptions found, using fallback")
        descriptions = ["Quality products available", "Fast shipping"]
    
    payload = {
        "campaign": {
            "name": campaign_name,
            "channel": "SEARCH",
            "budget_micros": int(budget_micros),
            "status": "PAUSED"
        },
        "ad_group": {
            "name": "Main Ad Group",
            "keywords": keywords[:20]
        },
        "responsive_search_ad": {
            "headlines": headlines[:15],
            "descriptions": descriptions[:4],
            "final_urls": [landing_url]
        },
        "ad_group_cpc_micros": 1_000_000
    }
    
    print(f"[Packager] Google payload created with {len(headlines)} headlines, {len(descriptions)} descriptions")
    return payload


########################################################################################################################################
# meta _packagerr agnet

from agents.utils import get_best_headline




from agents.utils import get_best_headline
from datetime import datetime, timedelta

def build_meta_payload(state):
    cfg = state["campaign_config"]
    ads = state.get("ads", {}).get("meta", {})

    headline = get_best_headline(ads, state.get("scored_keywords", {}))

    # ✅ Meta requires ≥ 24h for daily budget
    start = datetime.fromisoformat(cfg["start_time"])
    end = datetime.fromisoformat(cfg["end_time"])
    if (end - start).total_seconds() < 86400:
        end = start + timedelta(days=1)

    return {
        "campaign": {
            "name": cfg["campaign_name"],
            "objective": "OUTCOME_TRAFFIC",
            "status": "PAUSED",
            "special_ad_categories": []
        },
        "adset": {
            "name": "Auto AdSet",
            "daily_budget": cfg["budget_cents"],   # ✅ MUST be here
            "billing_event": "IMPRESSIONS",
            "optimization_goal": "LINK_CLICKS",
            "targeting": {
                "geo_locations": {
                    "countries": [cfg["location"]]
                }
            },
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
            "status": "PAUSED"
        },
        "creative": {
            "headline": headline,
            "descriptions": ads.get("descriptions", []),
            "landing_url": cfg["landing_url"],
            "call_to_action": "SHOP_NOW"
        }
    }
