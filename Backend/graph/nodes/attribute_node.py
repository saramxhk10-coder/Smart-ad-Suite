from models.state import VisionState
from agents.attribute_agent import extract_attributes

def attribute_node(state: VisionState) -> VisionState:
    caption = state.get("blip_caption", "")
    try:
        attributes = extract_attributes(caption)
        if not attributes:
            print("[Attribute Agent] No attributes found, using empty dict")
            attributes = {}
    except Exception as e:
        print("[Attribute Agent] Failed to extract attributes:", e)
        attributes = {}
    state["attributes"] = attributes
    return state
