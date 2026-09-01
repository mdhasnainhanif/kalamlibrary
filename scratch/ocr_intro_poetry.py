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

for p in [6, 7, 8]:
    page = doc.load_page(p - 1)
    pix = page.get_pixmap(dpi=150)
    img_path = f"temp_intro_poetry_{p}.png"
    pix.save(img_path)
    
    img = Image.open(img_path)
    
    print(f"\n--- PHYSICAL PAGE {p} TRANSCRIPTION ---")
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=[img, "This page contains poetry. Transcribe the title and all couplets in Urdu Unicode, and also provide the Roman English transliteration."]
    )
    # Safely print UTF-8 bytes to Windows console
    sys.stdout.buffer.write(response.text.strip().encode('utf-8'))
    print()
    
    if os.path.exists(img_path):
        os.remove(img_path)

doc.close()
