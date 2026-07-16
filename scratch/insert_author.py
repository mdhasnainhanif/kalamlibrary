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

author_name_roman = "Muhammad Ilyas Attar Qadri"
author_name_urdu = "محمد الیاس عطار قادری"

# Check if author exists
res = supabase.table("authors").select("id").eq("name_roman", author_name_roman).execute()
if res.data:
    print(f"Author {author_name_roman} already exists.")
else:
    print(f"Inserting author {author_name_roman}...")
    new_author = supabase.table("authors").insert({
        "name_roman": author_name_roman,
        "name_urdu": author_name_urdu,
        "bio": "Founder of Dawat-e-Islami and author of Wasail-e-Bakhshish."
    }).execute()
    print("Inserted successfully:", new_author.data)
