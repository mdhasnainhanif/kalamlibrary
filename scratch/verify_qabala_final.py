import os
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

# Query author id
author_res = supabase.table("authors").select("id, name_roman").ilike("name_roman", "%Jamil%").execute()

if author_res.data:
    author_id = author_res.data[0]["id"]
    author_name = author_res.data[0]["name_roman"]

    kalams_res = supabase.table("kalams").select("id, primary_title_roman, primary_title_urdu, slug").eq("author_id", author_id).execute()
    
    print(f"Author: {author_name}")
    print(f"Total Kalams Extracted & Uploaded: {len(kalams_res.data)}")
    
    # Check total kalams across whole database
    all_k = supabase.table("kalams").select("id").execute()
    print(f"Total Kalams across ENTIRE Library Website: {len(all_k.data)}")

    print("\nSample Extracted Kalams:")
    for k in kalams_res.data[:10]:
        print(f"  - {k['primary_title_roman']} | {k['primary_title_urdu']}")
