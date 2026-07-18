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

print("Searching for 'Mustafa' in kalams table:")
res = supabase.table("kalams").select("id, primary_title_roman, slug").ilike("primary_title_roman", "%mustafa%").execute()
for k in res.data:
    print(k)

print("\nSearching for 'Mustafa' in kalam_translations table:")
res_trans = supabase.table("kalam_translations").select("kalam_id, title, language").ilike("title", "%mustafa%").execute()
for t in res_trans.data:
    print(t)
