



# from agents.meta_publisher_agent import publish_meta_ads



# def meta_publisher_node(state):
#     state.setdefault("publish_results", {})

#     if state.get("platform") != "meta":
#         state["publish_results"]["meta"] = {}
#         return state

#     if "credentials" not in state or not state["credentials"]:
#         raise ValueError("Missing credentials")

#     if "packaged_payloads" not in state or "meta" not in state["packaged_payloads"]:
#         raise ValueError("Missing packaged_payloads['meta']")

#     try:
#         state["publish_results"]["meta"] = publish_meta_ads(state)
#     except Exception as e:
#         print("[Meta Publisher] Failed:", e)
#         state["publish_results"]["meta"] = {}

#     return state




from agents.meta_publisher_agent import publish_meta_ads

def meta_publisher_node(state):
    state.setdefault("publish_results", {})

    if state.get("platform") != "meta":
        state["publish_results"]["meta"] = {"status": "skipped"}
        return state

    # Validate required data
    if "credentials" not in state or not state["credentials"]:
        state["publish_results"]["meta"] = {"status": "failed", "error": "Missing credentials"}
        return state

    if "packaged_payloads" not in state or "meta" not in state["packaged_payloads"]:
        state["publish_results"]["meta"] = {"status": "failed", "error": "Missing packaged_payloads['meta']"}
        return state

    # Call agent
    try:
        result = publish_meta_ads(state)
        # Only overwrite if result is a dict with status
        if isinstance(result, dict) and "status" in result:
            state["publish_results"]["meta"] = result
        else:
            state["publish_results"]["meta"] = {"status": "failed", "error": "Invalid response from agent"}
    except Exception as e:
        state["publish_results"]["meta"] = {"status": "failed", "error": str(e)}

    return state
