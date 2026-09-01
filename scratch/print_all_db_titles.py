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
key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

author_res = supabase.table("authors").select("id").eq("name_roman", "Allama Hasan Raza Khan").execute()
author_id = author_res.data[0]["id"]

db_res = supabase.table("kalams").select("primary_title_roman").eq("author_id", author_id).execute()
titles = [k["primary_title_roman"] for k in db_res.data]

print("Total Kalams in DB for Allama Hasan Raza Khan:", len(titles))
print("\nTitles in DB:")
for t in sorted(titles):
    print("-", t)
