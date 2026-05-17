

from agents.ad_writer_agent import generate_ad
from models.state import VisionState

def ad_writer_node(state: VisionState):
    """
    Generates ad copy for Meta & Google.
    NEVER breaks state, even if LLM fails.
    """

    # Always initialize ads safely
    state.setdefault("ads", {})
    state["ads"].setdefault("meta", {"headlines": [], "descriptions": []})
    state["ads"].setdefault("google", {"headlines": [], "descriptions": []})

    # No keywords → skip generation safely
    if not state.get("final_keywords"):
        return state

    caption = state.get("blip_caption", "")
    attributes = state.get("normalized_attributes", {})
    keywords = (
        state["final_keywords"].get("primary", []) +
        state["final_keywords"].get("secondary", [])
    )

    print("[Ad Writer] Keywords:", keywords)
    print("[Ad Writer] Caption:", caption)
    print("[Ad Writer] Attributes:", attributes)

    try:
        ads = generate_ad(
            caption,
            attributes,
            keywords,
            platforms=["meta", "google"]  # 🔑 normalized names
        )

        # Merge instead of overwrite (CRITICAL)
        state["ads"]["meta"] = ads.get("meta", state["ads"]["meta"])
        state["ads"]["google"] = ads.get("google", state["ads"]["google"])

    except Exception as e:
        print("[Ad Writer] Failed, using fallback:", e)

        # Ensure fallback keys exist
        state["ads"].setdefault("meta", {"headlines": [], "descriptions": []})
        state["ads"].setdefault("google", {"headlines": [], "descriptions": []})

        # HARD FALLBACK — use first keyword
        if keywords:
            fallback_headline = keywords[0].replace("_", " ").title()
            state["ads"]["meta"]["headlines"] = [fallback_headline]
            state["ads"]["meta"]["descriptions"] = []
            state["ads"]["google"]["headlines"] = [fallback_headline]
            state["ads"]["google"]["descriptions"] = []

    return state
