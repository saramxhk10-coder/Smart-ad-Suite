





from typing import TypedDict, Optional, Dict, List

class VisionState(TypedDict, total=False):
    # Single-use keys (will not be regenerated in keyword retry)
    image_path: Optional[str]
    blip_caption: Optional[str]
    attributes: Optional[Dict[str, str]]
    normalized_attributes: Optional[Dict[str, List[str]]]

    # Keyword pipeline keys
    seed_keywords: Optional[List[str]]
    expanded_keywords: Optional[List[str]]
    classified_keywords: Optional[Dict[str, str]]
    scored_keywords: Optional[Dict[str, int]]
    final_keywords: Optional[Dict[str, List[str]]]

    # Ads, quality, compliance
    ads: Optional[Dict[str, Dict[str, List[str]]]]
    quality_results: Optional[Dict[str, Dict]]
    compliance_results: Optional[Dict[str, Dict]]

    # Meta/Google settings
    platform: Optional[str]
    campaign_config: Optional[Dict]
    packaged_payloads: Optional[Dict[str, Dict]]
    credentials: Optional[Dict[str, str]]

    # Internal loop flag
    requeue: Optional[bool]
