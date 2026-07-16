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

print(f"Connecting to {url}...")
supabase = create_client(url, key)

print("Listing authors (safe print):")
authors_res = supabase.table("authors").select("id, name_roman").execute()
for auth in authors_res.data:
    print(f"Author ID: {auth['id']} - Name: {auth['name_roman']}")

print(f"\nListing first 10 kalams:")
kalam_res = supabase.table("kalams").select("id, primary_title_roman, slug").limit(10).execute()
for k in kalam_res.data:
    print(f"Kalam ID: {k['id']} - Slug: {k['slug']}")

count_res = supabase.table("kalams").select("count", count="exact").execute()
print(f"\nTotal Kalams in DB: {count_res.count}")
