import json
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
key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

extracted_path = "public/zoq-e-naat_extracted.json"
if not os.path.exists(extracted_path):
    print("Extracted JSON not found")
    exit(1)

with open(extracted_path, 'r', encoding='utf-8') as f:
    extracted_data = json.load(f)

# Get all database Kalams for Allama Hasan Raza Khan
author_res = supabase.table("authors").select("id").eq("name_roman", "Allama Hasan Raza Khan").execute()
author_id = author_res.data[0]["id"]
db_res = supabase.table("kalams").select("primary_title_roman, slug").eq("author_id", author_id).execute()
db_titles = {k["primary_title_roman"].lower().strip(): k["slug"] for k in db_res.data}

print("Comparing JSON Kalam titles with database...")
missing = []
for idx, block in enumerate(extracted_data):
    if block.get("belongs_to_new_kalam"):
        title = block.get("title_roman_english", "").strip()
        if not title:
            continue
        if title.lower().strip() not in db_titles:
            missing.append(title)

print(f"\nFound {len(missing)} missing Kalams:")
for m in missing:
    print("-", m)
