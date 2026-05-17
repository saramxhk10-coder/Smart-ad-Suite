from agents.ad_writer_agent import generate_ad

def generate_ads_from_pipeline(state):
    """
    Generate ads for Meta using the final pipeline state.

    Args:
        state (dict): Output of the vision + attribute + keyword pipeline

    Returns:
        dict: Platform-specific ad creatives
    """
    caption = state["blip_caption"]
    attributes = state["normalized_attributes"]

    # Take top-ranked keywords
    top_keywords = state["final_keywords"]["primary"] + state["final_keywords"]["secondary"]

    platforms = ["Meta Ads"]

    ads_output = generate_ad(caption, attributes, top_keywords, platforms)
    return ads_output
