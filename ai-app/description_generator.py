from transformers import BlipProcessor, BlipForConditionalGeneration
import torch

# Load pre-trained model and processor
model_name = "Salesforce/blip-image-captioning-base"
processor = BlipProcessor.from_pretrained(model_name)
model = BlipForConditionalGeneration.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def generate_description(image):
    if image.mode != "RGB":
        image = image.convert(mode="RGB")

    inputs = processor(images=image, return_tensors="pt").to(device)
    
    generated_ids = model.generate(**inputs, max_new_tokens=50)
    generated_caption = processor.decode(generated_ids[0], skip_special_tokens=True)
    
    return generated_caption.strip()