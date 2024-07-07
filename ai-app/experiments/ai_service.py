from fastapi import FastAPI, File, UploadFile
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
from PIL import Image
import io

app = FastAPI()

# Load pre-trained model and processor
model_name = "Salesforce/blip-image-captioning-base"
processor = BlipProcessor.from_pretrained(model_name)
model = BlipForConditionalGeneration.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.post("/generate-description")
async def generate_description(file: UploadFile = File(...)):
    print("Received file:", file.filename)
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    if image.mode != "RGB":
        image = image.convert(mode="RGB")

    inputs = processor(images=image, return_tensors="pt").to(device)
    
    generated_ids = model.generate(**inputs, max_new_tokens=50)
    generated_caption = processor.decode(generated_ids[0], skip_special_tokens=True)
    
    return {"description": generated_caption.strip()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)