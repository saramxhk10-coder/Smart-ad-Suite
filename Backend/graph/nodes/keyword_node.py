import itertools
from typing import Dict, Any

GraphState = Dict[str, Any]

MODIFIERS = ["buy", "best", "price", "cheap", "premium", "online"]

def seed_keyword_node(state: GraphState):
    attrs = state.get("normalized_attributes",{})
    components = [
        attrs.get("gender",[]) or [""],
        attrs.get("color",[]) or [""],
        attrs.get("material",[]) or [""],
        attrs.get("category",[]) or [""]
    ]
    seeds = [" ".join(filter(None, combo)).strip() for combo in itertools.product(*components)]
    state["seed_keywords"]=seeds
    print("[Keyword] Seed keywords:", state.get("seed_keywords"))

    return state

def expand_keywords_node(state: GraphState):
    expanded = []
    for seed in state.get("seed_keywords",[]):
        for mod in MODIFIERS:
            expanded.append(f"{mod} {seed}".strip())
            expanded.append(f"{seed} {mod}".strip())
    state["expanded_keywords"]=list(set(expanded))
    print("[Keyword] Expanded keywords:", state.get("expanded_keywords"))

    return state

def intent_classifier_node(state: GraphState):
    classified = {}
    for kw in state.get("expanded_keywords",[]):
        kw_lower = kw.lower()
        if any(x in kw_lower for x in ["buy","price","sale","cheap"]):
            intent = "transactional"
        elif any(x in kw_lower for x in ["best","top","premium"]):
            intent = "commercial"
        else:
            intent = "informational"
        classified[kw] = intent
    state["classified_keywords"]=classified
    return state

def scoring_node(state: GraphState):
    scores = {}
    attrs = state.get("normalized_attributes",{})
    for kw,intent in state.get("classified_keywords",{}).items():
        score = 0
        for values in attrs.values():
            for v in values:
                if v.lower() in kw.lower(): score+=15
        if intent=="transactional": score+=30
        if len(kw.split())>=4: score+=10
        scores[kw] = min(score,100)
    state["scored_keywords"]=scores
    return state

def final_output_node(state: GraphState):
    sorted_keywords = sorted(state.get("scored_keywords",{}).items(), key=lambda x:x[1], reverse=True)
    if not sorted_keywords: return {"final_keywords":{"primary":[],"secondary":[],"long_tail":[]}}
    final = {
        "primary":[sorted_keywords[0][0]],
        "secondary":[kw for kw,_ in sorted_keywords[1:5]],
        "long_tail":[kw for kw,_ in sorted_keywords[5:15]]
    }
    state["final_keywords"]=final
    return state




