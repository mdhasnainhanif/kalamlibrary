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
total_pages = len(doc)

# Let's inspect pages from the end: e.g., 736, 730, 720, 710, 700 (0-indexed)
pages_to_check = [total_pages - 1, total_pages - 10, total_pages - 20, total_pages - 30, total_pages - 40]
out_lines = []

for p in pages_to_check:
    if p < 0 or p >= total_pages:
        continue
    page = doc.load_page(p)
    pix = page.get_pixmap(dpi=150)
    img_path = f"temp_check_end_{p+1}.png"
    pix.save(img_path)
    
    # Ask Gemini about this page
    img = Image.open(img_path)
    prompt = f"Identify the printed page number and describe briefly what is on this page (e.g., Kalam poetry, advertisement, table of contents, bibliography, etc.)."
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=[img, prompt]
        )
        msg = f"Physical PDF Page {p+1} (printed page check) -> {response.text.strip()}"
        print(f"Page {p+1} checked.")
        out_lines.append(msg)
    except Exception as e:
        msg = f"Page {p+1} failed: {e}"
        print(f"Page {p+1} failed.")
        out_lines.append(msg)
        
    # clean up
    if os.path.exists(img_path):
        os.remove(img_path)

doc.close()

with open("scratch/end_check_results.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(out_lines))
