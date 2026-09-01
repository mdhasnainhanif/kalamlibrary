import os
import json
import sys
from supabase import create_client

sys.stdout.reconfigure(encoding='utf-8')

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
supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")

supabase = create_client(supabase_url, supabase_key)

# Check progress file
progress_file = r"public/qabala-e-bakhshish_progress_stateful.json"
processed_ranges = []
if os.path.exists(progress_file):
    try:
        with open(progress_file, 'r') as f:
            processed_ranges = json.load(f)
    except Exception:
        pass

# Query author id for Maulana Muhammad Jamil-ur-Rehman Razvi
author_res = supabase.table("authors").select("id, name_roman").ilike("name_roman", "%Jamil%").execute()

kalam_count = 0
author_name = "Maulana Muhammad Jamil-ur-Rehman Razvi"
if author_res.data:
    author_id = author_res.data[0]["id"]
    author_name = author_res.data[0]["name_roman"]
    k_res = supabase.table("kalams").select("id, primary_title_roman, primary_title_urdu").eq("author_id", author_id).execute()
    kalam_count = len(k_res.data)

print(f"Processed Page Ranges: {len(processed_ranges)} chunks ({processed_ranges[-1] if processed_ranges else 'None'})")
print(f"Author: {author_name}")
print(f"Uploaded Kalams in Supabase: {kalam_count}")
