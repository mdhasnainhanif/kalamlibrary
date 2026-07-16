import os
import sys
import fitz
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

def main():
    env = load_env()
    gemini_api_key = env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        print("GEMINI_API_KEY not found.")
        sys.exit(1)

    from google import genai
    client = genai.Client(api_key=gemini_api_key)

    pdf_path = "public/hadaiq-e-bakhshish.pdf"
    doc = fitz.open(pdf_path)
    # Book page 15 is index 14
    page = doc.load_page(14)
    pix = page.get_pixmap(dpi=150)
    img_path = "scratch/temp_page_15.png"
    pix.save(img_path)
    doc.close()

    print("Rendered page 15. Loading image...")
    pil_img = Image.open(img_path)

    print("Testing gemini-3.1-flash-lite...")
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=[pil_img, "Transcribe the first 2 lines of Urdu text from this page."]
        )
        print("SUCCESS! Response:")
        print(response.text.strip())
    except Exception as e:
        print("FAILED: gemini-2.5-flash. Error:", e)
    finally:
        if os.path.exists(img_path):
            os.remove(img_path)

if __name__ == "__main__":
    main()
