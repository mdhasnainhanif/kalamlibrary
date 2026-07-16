import os
import sys

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

    try:
        with open("scratch/models_list.txt", "w", encoding="utf-8") as out:
            for m in client.models.list():
                out.write(f"{m.name}\n")
        print("SUCCESS: Wrote model list to scratch/models_list.txt")
    except Exception as e:
        print("Failed to list models:", e)

if __name__ == "__main__":
    main()
