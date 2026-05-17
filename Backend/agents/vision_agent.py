from graph.pipeline import vision_pipeline

class VisionAgent:
    def analyze(self, image_path: str):
        return vision_pipeline.invoke({
            "image_path": image_path
        })

vision_agent = VisionAgent()