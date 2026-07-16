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

    models_to_test = [
        "gemini-2.0-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ]

    for model in models_to_test:
        print(f"\nTesting model: {model}...")
        try:
            response = client.models.generate_content(
                model=model,
                contents="Hello, this is a test query."
            )
            print(f"SUCCESS: {model} responded! Snippet: {response.text.strip()[:100]}")
        except Exception as e:
            print(f"FAILED: {model}. Error: {e}")

if __name__ == "__main__":
    main()
