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
model_name = "gemini-3.1-flash-lite"

pdf_path = "public/wasail-e-bakhshish.pdf"
doc = fitz.open(pdf_path)
total_pages = len(doc)

out_lines = []

# Scan physical pages 720 to 736
for p in range(720, 736):
    page = doc.load_page(p)
    pix = page.get_pixmap(dpi=150)
    img_path = f"temp_end_scan_{p+1}.png"
    pix.save(img_path)
    
    img = Image.open(img_path)
    prompt = "Tell me the printed page number and what is on this page (e.g. index/table of contents, poetry (Kalam) or back cover/advertisement). If it is poetry, what is the heading? If it is table of contents, specify it."
    
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=[img, prompt]
        )
        msg = f"Physical Page {p+1} -> {response.text.strip()}"
        print(f"Physical Page {p+1} processed.")
        out_lines.append(msg)
    except Exception as e:
        msg = f"Physical Page {p+1} failed: {e}"
        print(f"Physical Page {p+1} failed.")
        out_lines.append(msg)
        
    if os.path.exists(img_path):
        os.remove(img_path)

doc.close()

with open("scratch/end_scan_results.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(out_lines))
print("Done!")
