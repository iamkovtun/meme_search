from fastapi import FastAPI, File, UploadFile
from transformers import CLIPProcessor, CLIPModel
import torch
from PIL import Image
import io
import nltk
from nltk.corpus import words
import random

app = FastAPI()

# Load pre-trained CLIP model and processor
model_name = "openai/clip-vit-base-patch32"
processor = CLIPProcessor.from_pretrained(model_name)
model = CLIPModel.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Download NLTK words dataset
nltk.download('words')
word_list = words.words()

@app.post("/detect-objects")
async def detect_objects(file: UploadFile = File(...)):
    print("Received file:", file.filename)
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    if image.mode != "RGB":
        image = image.convert(mode="RGB")

    # Sample a subset of words to use as potential object labels
    sampled_words = random.sample(word_list, 1000)

    inputs = processor(text=sampled_words, images=image, return_tensors="pt", padding=True).to(device)
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    logits_per_image = outputs.logits_per_image
    probs = logits_per_image.softmax(dim=1)
    
    # Get the top 10 predictions
    top_10_probs, top_10_indices = torch.topk(probs[0], 10)
    
    detected_objects = [
        {"object": sampled_words[i], "confidence": float(prob)}
        for i, prob in zip(top_10_indices.tolist(), top_10_probs.tolist())
    ]
    
    return {"detected_objects": detected_objects}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)