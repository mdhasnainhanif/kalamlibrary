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
supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(supabase_url, supabase_key)

res = supabase.table("kalams").select("id, slug, primary_title_roman, primary_title_urdu, authors(name_roman)").execute()

print(f"Total Kalams in DB: {len(res.data)}")

deegar_count = 0
for k in res.data:
    r_title = k['primary_title_roman'] or ''
    u_title = k['primary_title_urdu'] or ''
    if r_title.lower().strip() in ['deegar', 'digar'] or u_title.strip() in ['دیگر']:
        deegar_count += 1
        print(f"STILL DEEGAR: ID={k['id']}, Slug={k['slug']}")

print(f"Remaining Deegar titles in DB: {deegar_count}")
