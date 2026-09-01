import fitz
import os
import sys
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

# Render pages 18, 19, 20, 21 (1-based: 19, 20, 21, 22)
temp_images = []
for p in range(18, 22):
    page = doc.load_page(p)
    pix = page.get_pixmap(dpi=150)
    img_path = f"temp_p19_{p+1}.png"
    pix.save(img_path)
    temp_images.append(img_path)
doc.close()

client = genai.Client(api_key=gemini_key)
pil_images = [Image.open(path) for path in temp_images]

prompt = """
Examine attached pages 19, 20, 21, 22 of Qabala-e-Bakhshish.
Describe:
1. Is Page 19 (first image) the start of Hamd / Naat poetry?
2. What is the title of the first Kalam starting on page 19?
3. How are titles formatted (are they bold / headings at top)?
4. List the titles of kalams found on these pages.
"""

res = client.models.generate_content(
    model="gemini-3.1-flash-lite",
    contents=pil_images + [prompt]
)

print(res.text)

for p in temp_images:
    if os.path.exists(p):
        os.remove(p)
