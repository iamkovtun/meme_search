from fastapi import FastAPI, File, UploadFile
import easyocr
from PIL import Image
import io
import numpy as np

app = FastAPI()

# Initialize the OCR reader
reader = easyocr.Reader(['en'])  # For English. Add more languages if needed

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    print("Received file:", file.filename)
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Convert PIL Image to numpy array
    image_np = np.array(image)
    
    # Perform OCR
    result = reader.readtext(image_np)
    
    # Extract text from results
    extracted_text = " ".join([text for _, text, _ in result])
    
    return {"extracted_text": extracted_text.strip()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)