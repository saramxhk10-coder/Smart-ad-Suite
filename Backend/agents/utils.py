


def get_best_headline(ads, scored_keywords):
    # Support both old and new naming
    meta_ads = ads.get("meta") or ads.get("Meta Ads") or {}
    headlines = meta_ads.get("headlines", [])

    # 1️⃣ If headlines exist → use best one
    if headlines:
        return headlines[0]

    # 2️⃣ Fallback: generate from scored keywords
    if scored_keywords:
        best_kw = max(scored_keywords, key=scored_keywords.get)
        return best_kw.title()

    # 3️⃣ Absolute fallback (never crash)
    return "Shop Now"
