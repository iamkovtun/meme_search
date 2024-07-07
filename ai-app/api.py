from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io
from description_generator import generate_description
from text_extractor import extract_text

app = FastAPI()

@app.post("/generate-description")
async def generate_description_endpoint(image: UploadFile = File(...)):
    print("Received file:", image.filename)
    contents = await image.read()
    image = Image.open(io.BytesIO(contents))
    
    description = generate_description(image)
    extracted_text = extract_text(image, timeout=10)  # 10-second timeout
    
    return {
        "description": description,
        "extracted_text": extracted_text
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)