


from langgraph.graph import StateGraph
from models.state import VisionState

# Nodes
from graph.nodes.attribute_node import attribute_node
from graph.nodes.blip_node import blip_node
from graph.nodes.normalize_node import normalize_node
from graph.nodes.writer_node import ad_writer_node
from graph.nodes.critic_node import critic_node
from graph.nodes.compliance_node import compliance_node
from graph.nodes.packager_node import packager_node
from graph.nodes.meta_publisher_node import meta_publisher_node
from graph.nodes.google_publisher_node import google_publish_node
from graph.nodes.keyword_node import (
    seed_keyword_node,
    expand_keywords_node,
    intent_classifier_node,
    scoring_node,
    final_output_node
)


def route_publisher(state):
    platform = state.get("platform")
    if platform == "meta":
        return "meta"
    if platform == "google":
        return "google"
    return "end"  #
# ---------------------------
# Create Graph
# ---------------------------
graph = StateGraph(VisionState)

# --- Add Nodes ---
graph.add_node("blip", blip_node)
graph.add_node("attribute", attribute_node)
graph.add_node("normalize", normalize_node)

# Keyword pipeline
graph.add_node("seed_keyword", seed_keyword_node)
graph.add_node("expand_keyword", expand_keywords_node)
graph.add_node("intent_classifier", intent_classifier_node)
graph.add_node("scoring", scoring_node)
graph.add_node("final_output", final_output_node)

# Ad Writer & Post-processing
graph.add_node("ad_writer", ad_writer_node)
graph.add_node("critic", critic_node)
graph.add_node("compliance", compliance_node)
graph.add_node("packager", packager_node)

# Publisher nodes
graph.add_node("meta_publisher_node", meta_publisher_node)
graph.add_node("google_publisher_node", google_publish_node)

# ---------------------------
# Define Graph Structure
# ---------------------------
graph.set_entry_point("blip")

# BLIP → Attribute → Normalize
graph.add_edge("blip", "attribute")
graph.add_edge("attribute", "normalize")

# Keyword pipeline
graph.add_edge("normalize", "seed_keyword")
graph.add_edge("seed_keyword", "expand_keyword")
graph.add_edge("expand_keyword", "intent_classifier")
graph.add_edge("intent_classifier", "scoring")
graph.add_edge("scoring", "final_output")

# Ad Writer → Critic
graph.add_edge("final_output", "ad_writer")
graph.add_edge("ad_writer", "critic")

# Critic → Compliance or Retry
graph.add_conditional_edges(
    "critic",
    lambda state: "requeue" if state.get("requeue") else "continue",
    {
        "requeue": "seed_keyword",   # 🔁 restart keyword pipeline
        "continue": "compliance"     # ➡ normal flow
    }
)

# Compliance → Packager
graph.add_edge("compliance", "packager")

# Packager → Publisher (conditional)
# graph.add_conditional_edges(
#     "packager",
#     lambda state: "meta" if state.get("platform") == "meta" else "google",
#     {
#         "meta": "meta_publisher_node",
#         "google": "google_publisher_node"
#     }
# )

graph.add_conditional_edges(
    "packager",
    route_publisher,
    {
        "meta": "meta_publisher_node",
        "google": "google_publisher_node"
    }
)

# ---------------------------
# Compile Pipeline
# ---------------------------
compiled_pipeline = graph.compile()
