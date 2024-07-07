from fastapi import FastAPI, File, UploadFile
import pytesseract
from PIL import Image
import io
from pathlib import Path

app = FastAPI()

# Set the path to the Tesseract executable
tesseract_path = Path('C:/Program Files/Tesseract-OCR/tesseract.exe')
pytesseract.pytesseract.tesseract_cmd = str(tesseract_path)

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    print("Received file:", file.filename)
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Perform OCR
    text = pytesseract.image_to_string(image)
    print("Extracted text:", text)
    
    return {"extracted_text": text.strip()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)