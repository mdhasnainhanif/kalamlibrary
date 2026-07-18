import os

def load_env_keys():
    keys = []
    for file in ['.env', '.env.local']:
        if os.path.exists(file):
            print(f"Keys in {file}:")
            with open(file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, _ = line.split('=', 1)
                        print("  -", key.strip())

load_env_keys()
