import os
import sys
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

image_path = "c:\\Users\\wajiz.pk\\OneDrive\\Desktop\\hasnain\\nextjs2\\kalamlibrary\\scratch\\page_18.png"
if not os.path.exists(image_path):
    print("Image not found at:", image_path)
    sys.exit(1)

img = Image.open(image_path)

print("Sending page 17 to Gemini for transcription...")
response = client.models.generate_content(
    model="gemini-3.1-flash-lite",
    contents=[img, "Identify if this is a poetry page. If so, transcribe the title and the first couplet in Urdu Unicode. If it is a preface, table of contents, or introductory page, summarize what it contains."]
)

print("\n--- GEMINI RESPONSE ---")
# Safely encode stdout output for Windows console
sys.stdout.buffer.write(response.text.encode('utf-8'))
print()
