from fastapi import FastAPI, File, UploadFile
from transformers import AutoProcessor, AutoModelForCausalLM
import torch
from PIL import Image
import io


app = FastAPI()

# Load pre-trained model and processor
model_name = "microsoft/Florence-2-large-ft"
processor = AutoProcessor.from_pretrained(model_name, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.post("/generate-description")
async def generate_description(file: UploadFile = File(...)):
    print("Received file:", file.filename)
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    if image.mode != "RGB":
        image = image.convert(mode="RGB")

    prompt = "<OD>"
    inputs = processor(text=prompt, images=image, return_tensors="pt")
    
    # Move inputs to the same device as the model
    inputs = {k: v.to(device) for k, v in inputs.items()}

    generated_ids = model.generate(
        input_ids=inputs["input_ids"],
        pixel_values=inputs["pixel_values"],
        max_new_tokens=1024,
        do_sample=False,
        num_beams=3
    )
    
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]
    parsed_answer = processor.post_process_generation(generated_text, task="<OD>", image_size=(image.width, image.height))
    
    return {"description": parsed_answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)