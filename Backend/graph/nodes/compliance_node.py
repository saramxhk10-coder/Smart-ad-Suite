from typing import TypedDict
from agents.compliance_agent import extended_compliance_check
from models.state import VisionState

class ComplianceState(TypedDict):
    ads: dict

def compliance_node(state: VisionState):
    if "ads" not in state or not state["ads"]:
        state["compliance_results"] = {}
        return state

    state["compliance_results"] = extended_compliance_check(state["ads"])
    return state