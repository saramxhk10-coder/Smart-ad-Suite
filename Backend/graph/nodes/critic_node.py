from typing import TypedDict
from agents.critic_agent import critique_ads
from models.state import VisionState

class CriticState(TypedDict):
    ads: dict
    final_keywords: dict





def critic_node(state: VisionState):
    if "ads" not in state or not state["ads"]:
        state["quality_results"] = {"avg_score": 0}
        state["requeue"] = True
        return state

    top_keywords = (
        state["final_keywords"]["primary"] +
        state["final_keywords"]["secondary"]
    )

    scores = critique_ads(state["ads"], top_keywords)

    # 🔢 Compute average score
    all_scores = []
    for platform_data in scores.values():
        score = platform_data.get("quality_score")
        if isinstance(score, (int, float)):
            all_scores.append(score)

    avg_score = sum(all_scores) / len(all_scores) if all_scores else 0

    state["quality_results"] = {
        "platform_scores": scores,
        "avg_score": avg_score
    }

    # 🔁 TRIGGER LOOP
    state["requeue"] = avg_score < 75

    return state
