import fitz
import os
import sys
import json
from PIL import Image
from google import genai

sys.stdout.reconfigure(encoding='utf-8')

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
gemini_key = env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")

pdf_path = r"c:\Users\wajiz.pk\OneDrive\Desktop\hasnain\nextjs2\kalamlibrary\public\qabala-e-bakhshish.pdf"
doc = fitz.open(pdf_path)

# Render pages 1, 2, 3, 4, 5, 19
temp_images = []
for p in [0, 1, 2, 3, 4, 18]:
    page = doc.load_page(p)
    pix = page.get_pixmap(dpi=150)
    img_path = f"temp_cover_{p+1}.png"
    pix.save(img_path)
    temp_images.append(img_path)
doc.close()

client = genai.Client(api_key=gemini_key)
pil_images = [Image.open(path) for path in temp_images]

prompt = """
Examine these pages from the attached Islamic book PDF.
Identify:
1. Book Title (Urdu and English transliteration)
2. Author/Poet Name (Urdu and English transliteration)
3. What is on Page 19? (Is page 19 the start of poetry / Kalams?)
"""

res = client.models.generate_content(
    model="gemini-3.1-flash-lite",
    contents=pil_images + [prompt]
)

print(res.text)

# Cleanup
for p in temp_images:
    if os.path.exists(p):
        os.remove(p)
