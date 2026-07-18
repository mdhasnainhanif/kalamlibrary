import os
import sys
import fitz
from PIL import Image
from google import genai

def load_env():
    env = {}
    for file in ['.env', '.env.local']:
        if os.path.exists(file):
            with open(file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, val = line.split('=', 1)
                        env[key.strip()] = val.strip().strip("'").strip('"')
    return env

env = load_env()
gemini_api_key = env.get("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)

pdf_path = "c:\\Users\\wajiz.pk\\OneDrive\\Desktop\\hasnain\\nextjs2\\kalamlibrary\\public\\zoq-e-naat.pdf"
doc = fitz.open(pdf_path)

print("Scanning pages 15 to 40 of PDF to find the first poem starting page...")

for physical_page in range(15, 41):
    # render page to image
    page = doc.load_page(physical_page - 1)
    pix = page.get_pixmap(dpi=100) # low dpi is fast
    img_path = f"temp_scan_{physical_page}.png"
    pix.save(img_path)
    
    img = Image.open(img_path)
    
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=[img, "Identify if this page contains poetry lines/couplets. Output 'YES: [Urdu Title]' if it contains poetry and is the start of a poem, or 'YES: (Continuation)' if it is a continuation of a poem, or 'NO' if it is just prose text, index, or preface."]
    )
    
    ans = response.text.strip()
    sys.stdout.buffer.write(f"Physical Page {physical_page}: {ans}\n".encode('utf-8'))
    
    # Clean up temp image
    if os.path.exists(img_path):
        os.remove(img_path)
        
    if "YES" in ans:
        sys.stdout.buffer.write(f"\nFound it! Poetry starts at Physical Page: {physical_page}\n".encode('utf-8'))
        break

doc.close()
