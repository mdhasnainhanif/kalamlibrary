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
model_name = "gemini-3.1-flash-lite"

print(f"Testing {model_name}...")
try:
    response = client.models.generate_content(
        model=model_name,
        contents=[img, "Describe this page and transcribe any Urdu text visible at the top of the page."]
    )
    with open("scratch/test_3_1_output.txt", "w", encoding="utf-8") as f:
        f.write(response.text)
    print("SUCCESS! Output written to scratch/test_3_1_output.txt")
except Exception as e:
    print(f"FAILED with {model_name}: {e}")
