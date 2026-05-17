




from agents.packager_agent import build_meta_payload, build_google_payload
from models.state import VisionState

def packager_node(state: VisionState) -> VisionState:
    """
    Generates platform-specific payloads for Meta & Google.
    Safely updates state["packaged_payloads"].
    """
    state.setdefault("campaign_config", {})
    state.setdefault("ads", {
        "meta": {"headlines": [], "descriptions": []},
        "google": {"headlines": [], "descriptions": []}
    })
    state.setdefault("packaged_payloads", {})

    platform = state.get("platform")

    try:
        if platform == "meta":
            payload = build_meta_payload(state)
            state["packaged_payloads"]["meta"] = payload
        elif platform == "google":
            payload = build_google_payload(state)
            state["packaged_payloads"]["google"] = payload
        else:
            # Unknown platform, do nothing
            state["packaged_payloads"][platform] = {}
    except Exception as e:
        print(f"[Packager Node] Failed for platform {platform}:", e)
        state["packaged_payloads"][platform] = {}

    return state
