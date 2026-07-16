import os
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

img = Image.open("temp_wasail_page_75.png") # printed page 61/physical page 75

models_to_test = [
    "gemini-2.0-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
]

for m in models_to_test:
    print(f"\nTesting model: {m}...")
    try:
        response = client.models.generate_content(
            model=m,
            contents=[img, "Describe this image in one sentence."]
        )
        print(f"SUCCESS with {m}: {response.text.strip()[:100]}")
    except Exception as e:
        print(f"FAILED with {m}: {e}")
