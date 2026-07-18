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

# Find Hasan Raza Khan
author_res = supabase.table("authors").select("id").eq("name_roman", "Allama Hasan Raza Khan").execute()
if author_res.data:
    author_id = author_res.data[0]["id"]
    kalam_res = supabase.table("kalams").select("id, primary_title_roman").eq("author_id", author_id).execute()
    print("Total Kalams for Allama Hasan Raza Khan in DB:", len(kalam_res.data))
    for k in kalam_res.data:
        print(k)
else:
    print("Allama Hasan Raza Khan author not found!")
