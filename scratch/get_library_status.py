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

# 1. Authors
authors_res = supabase.table("authors").select("id, name_roman, name_urdu").execute()
authors_map = {a["id"]: a for a in authors_res.data}

# 2. Kalams
kalams_res = supabase.table("kalams").select("id, primary_title_roman, primary_title_urdu, slug, author_id").execute()

total_raw = len(kalams_res.data)

author_counts = {}
valid_kalams = 0

for k in kalams_res.data:
    r_title = (k['primary_title_roman'] or '').strip()
    u_title = (k['primary_title_urdu'] or '').strip()
    slug = (k['slug'] or '').strip()

    if r_title.lower() in ['deegar', 'digar'] or u_title in ['دیگر'] or slug.startswith('deegar') or slug.startswith('digar'):
        continue

    valid_kalams += 1
    a_id = k.get("author_id")
    a_info = authors_map.get(a_id, {})
    a_name = a_info.get("name_roman", "Unknown Poet")
    
    author_counts[a_name] = author_counts.get(a_name, 0) + 1

# 3. Translations count
trans_res = supabase.table("kalam_translations").select("id, language").execute()
trans_count = len(trans_res.data)

print(f"Total Valid Kalams: {valid_kalams}")
print(f"Total Poets: {len(authors_map)}")
print(f"Total Translation Records: {trans_count}")
print("\nPer Author Breakdown:")
for author, count in sorted(author_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  - {author}: {count} Kalams")
