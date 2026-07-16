import os
import json
from google import genai
from PIL import Image

# Load environment
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

# Open images
img1 = Image.open("temp_wasail_page_1.png")
img74 = Image.open("temp_wasail_page_74.png")
img75 = Image.open("temp_wasail_page_75.png")
img76 = Image.open("temp_wasail_page_76.png")

print("Listing models...")
try:
    for m in client.models.list():
        print(f"Model: {m.name} (supported: {m.supported_actions})")
except Exception as e:
    print("Could not list models:", e)

# Let's try gemini-3.5-flash
model_name = "gemini-3.5-flash"
print(f"Using model: {model_name}")

# Let's write output to a file with utf-8 encoding to avoid Windows console errors
out_lines = []

print("Asking Gemini about the cover page (temp_wasail_page_1.png)...")
try:
    response = client.models.generate_content(
        model=model_name,
        contents=[img1, "Look at this book cover/first page. Tell me the title of the book and the author name (in English/Roman and Urdu if visible)."]
    )
    out_lines.append("=== Cover Page Response ===")
    out_lines.append(response.text)
except Exception as e:
    out_lines.append(f"Cover page request failed: {e}")

print("\nAsking Gemini about pages 74, 75, 76...")
try:
    response_kalam = client.models.generate_content(
        model=model_name,
        contents=[img74, img75, img76, "Look at pages 74, 75, and 76. Describe what is on these pages, if page 75 has a kalam starting, its Urdu title, its transliterated roman title, and who the poet/author seems to be on these pages."]
    )
    out_lines.append("=== Pages 74-76 Response ===")
    out_lines.append(response_kalam.text)
except Exception as e:
    out_lines.append(f"Pages 74-76 request failed: {e}")

output_file = "scratch/author_info.txt"
with open(output_file, "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print(f"Results written to {output_file}")
