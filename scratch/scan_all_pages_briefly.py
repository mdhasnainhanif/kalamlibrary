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

print(f"Scanning target pages (1-19 and 321-322) of Zoq-e-Naat PDF for poetry lines...")

poetry_pages = []
target_pages = list(range(1, 20)) + list(range(321, total_pages + 1))
for p in target_pages:
    page = doc.load_page(p - 1)
    pix = page.get_pixmap(dpi=80) # lower DPI for faster processing
    img_path = f"temp_qa_page_{p}.png"
    pix.save(img_path)
    
    img = Image.open(img_path)
    
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=[img, "Does this page contain printed poetry lines? Answer ONLY 'YES' or 'NO'."]
        )
        ans = response.text.strip().upper()
        if "YES" in ans:
            poetry_pages.append(p)
            sys.stdout.buffer.write(f"Page {p}: YES\n".encode('utf-8'))
        else:
            sys.stdout.buffer.write(f"Page {p}: NO\n".encode('utf-8'))
    except Exception as e:
        sys.stdout.buffer.write(f"Page {p}: ERROR ({e})\n".encode('utf-8'))
        
    if os.path.exists(img_path):
        os.remove(img_path)

print("\n--- QA REPORT ---")
print("Total pages containing poetry:", len(poetry_pages))
print("List of poetry pages:", poetry_pages)

doc.close()
