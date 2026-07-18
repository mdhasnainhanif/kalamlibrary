import os
from supabase import create_client

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
url = env.get("NEXT_PUBLIC_SUPABASE_URL")
key = env.get("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, key)

res = supabase.table("authors").insert({
    "name_roman": "Test Ingestion",
    "name_urdu": "ٹیسٹ",
    "bio": "Testing RLS on authors table"
}).execute()

print("Insert response:", res)
