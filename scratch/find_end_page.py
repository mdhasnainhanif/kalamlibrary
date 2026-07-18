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
total_pages = len(doc)

print(f"Scanning from page {total_pages} backwards to find the last page containing poetry...")

for physical_page in range(total_pages, 280, -1):
    # render page to image
    page = doc.load_page(physical_page - 1)
    pix = page.get_pixmap(dpi=100)
    img_path = f"temp_scan_end_{physical_page}.png"
    pix.save(img_path)
    
    img = Image.open(img_path)
    
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=[img, "Identify if this page contains poetry lines/couplets (Urdu/Roman/etc.). Output 'YES' if it contains actual poetry, or 'NO' if it is a book index, table of contents, advertisement, publisher note, or blank page."]
    )
    
    ans = response.text.strip()
    sys.stdout.buffer.write(f"Physical Page {physical_page}: {ans}\n".encode('utf-8'))
    
    # Clean up
    if os.path.exists(img_path):
        os.remove(img_path)
        
    if "YES" in ans:
        sys.stdout.buffer.write(f"\nFound it! Poetry ends at Physical Page: {physical_page}\n".encode('utf-8'))
        break

doc.close()
