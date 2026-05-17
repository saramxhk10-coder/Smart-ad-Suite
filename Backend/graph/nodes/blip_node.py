from PIL import Image
import torch
from models.blip import processor, model, device
from models.state import VisionState

def blip_node(state: VisionState) -> VisionState:
    image = Image.open(state["image_path"]).convert("RGB")

    inputs = processor(image, return_tensors="pt").to(device)
    with torch.no_grad():
        output = model.generate(**inputs, max_length=50)

    caption = processor.decode(output[0], skip_special_tokens=True)
    print("[DEBUG] BLIP caption:", caption)

    state["blip_caption"] = caption

    return state
