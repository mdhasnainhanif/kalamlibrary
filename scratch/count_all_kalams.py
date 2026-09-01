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

# Get total kalams
res = supabase.table("kalams").select("id, slug, primary_title_roman, primary_title_urdu, author_id, authors(name_roman)").execute()

valid_kalams = []
deegar_filtered = 0

author_counts = {}

for k in res.data:
    r_title = (k['primary_title_roman'] or '').strip()
    u_title = (k['primary_title_urdu'] or '').strip()
    slug = (k['slug'] or '').strip()

    if r_title.lower() in ['deegar', 'digar'] or u_title in ['دیگر'] or slug.startswith('deegar') or slug.startswith('digar'):
        deegar_filtered += 1
        continue

    valid_kalams.append(k)

    author_name = "Unknown Poet"
    if k.get("authors"):
        a_data = k["authors"]
        author_name = a_data[0]["name_roman"] if isinstance(a_data, list) else a_data.get("name_roman", "Unknown Poet")

    author_counts[author_name] = author_counts.get(author_name, 0) + 1

print(f"Total Valid Kalams: {len(valid_kalams)}")
print(f"Filtered Placeholder/Duplicate Kalams: {deegar_filtered}")
print(f"Total Raw Records: {len(res.data)}")
print("\nBreakdown by Author:")
for author, count in sorted(author_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  - {author}: {count} Kalams")
