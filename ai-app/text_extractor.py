import easyocr
import numpy as np
import threading
import time

# Initialize the OCR reader
reader = easyocr.Reader(['en'])

class TimeoutException(Exception):
    pass

def extract_text_with_timeout(image_np, timeout):
    result = []
    
    def ocr_thread():
        nonlocal result
        result = reader.readtext(image_np)

    thread = threading.Thread(target=ocr_thread)
    thread.start()
    thread.join(timeout)
    
    if thread.is_alive():
        print(f"OCR operation timed out after {timeout} seconds")
        return None
    
    extracted_text = " ".join([text for _, text, _ in result])
    return extracted_text.strip() if extracted_text else None

def extract_text(image, timeout=5):
    # Convert PIL Image to numpy array
    image_np = np.array(image)
    
    start_time = time.time()
    extracted_text = extract_text_with_timeout(image_np, timeout)
    end_time = time.time()
    
    if extracted_text is not None:
        print(f"OCR completed in {end_time - start_time:.2f} seconds")
    
    return extracted_text