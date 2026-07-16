import os
import fitz
from google import genai
from PIL import Image

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
client = genai.Client(api_key=env.get("GEMINI_API_KEY"))
model_name = "gemini-3.5-flash"

pdf_path = "public/wasail-e-bakhshish.pdf"
doc = fitz.open(pdf_path)

# Let's render physical pages: 74, 75, 76, 88, 89, 90, 91 (0-indexed)
pages_to_check = [74, 75, 76, 88, 89, 90, 91]
out_lines = []

for p in pages_to_check:
    page = doc.load_page(p)
    pix = page.get_pixmap(dpi=150)
    img_path = f"temp_check_page_{p+1}.png"
    pix.save(img_path)
    
    # Ask Gemini about this page
    img = Image.open(img_path)
    prompt = f"Identify the printed page number (look at the top or bottom of the page) and describe briefly if this page has any poetry (Kalam) starting, or if it is vocabulary/index. If poetry starts, what is the heading?"
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=[img, prompt]
        )
        text = response.text.strip()
        msg = f"Physical PDF Page {p+1} -> {text}"
        print(f"Physical PDF Page {p+1} query succeeded.")
        out_lines.append(msg)
    except Exception as e:
        msg = f"Physical PDF Page {p+1} failed: {str(e)}"
        print(f"Physical PDF Page {p+1} query failed: {str(e)[:50]}")
        out_lines.append(msg)
        
    # clean up
    if os.path.exists(img_path):
        os.remove(img_path)

doc.close()

with open("scratch/page_check_results.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(out_lines))
