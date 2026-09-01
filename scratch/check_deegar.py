import os
import re
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

res = supabase.table("kalams").select("id, slug, primary_title_roman, primary_title_urdu, author_id").ilike("primary_title_roman", "%deegar%").execute()

print(f"Found {len(res.data)} kalams with 'Deegar' in primary_title_roman:")
for k in res.data:
    print(f"\nKalam ID: {k['id']}, Slug: {k['slug']}, Title Roman: '{k['primary_title_roman']}', Title Urdu: '{k['primary_title_urdu']}'")
    t_res = supabase.table("kalam_translations").select("id, language, title, lyrics").eq("kalam_id", k['id']).execute()
    for t in t_res.data:
        first_line = (t['lyrics'].split('\n')[0] if t['lyrics'] else '').strip()
        print(f"  [Lang: {t['language']}] Trans Title: '{t['title']}'")
        print(f"      First line: {first_line[:80]}")
