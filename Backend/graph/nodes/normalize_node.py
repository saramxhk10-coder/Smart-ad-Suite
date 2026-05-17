from models.state import VisionState

NORMALIZATION_MAP = {
    "sneakers": ["sneakers", "shoes", "trainers"],
    "men": ["men", "mens"],
    "white": ["white", "off white"],
    "leather": ["leather", "genuine leather"],
    "casual": ["casual", "everyday"]
}

def normalize_node(state: VisionState) -> VisionState:
    attrs = state.get("attributes") or {}
    normalized = {
        k: NORMALIZATION_MAP.get(v.lower(), [v])
        for k, v in attrs.items()
        if v
    }
    state["normalized_attributes"] = normalized
    print("[DEBUG] Normalized attributes:", normalized)
    return state
