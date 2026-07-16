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

kalam_slug = "hamare-dil-se-zamane-ke-gham-mita-ya-rab"
res = supabase.table("kalams").select("id, primary_title_roman").eq("slug", kalam_slug).execute()
if res.data:
    kalam_id = res.data[0]["id"]
    print("Found Kalam:", res.data[0])
    
    trans_res = supabase.table("kalam_translations").select("language, title, lyrics").eq("kalam_id", kalam_id).execute()
    for trans in trans_res.data:
        print(f"\n--- Language: {trans['language']} ---")
        lyrics = trans['lyrics']
        # Count lines
        lines = lyrics.strip().split('\n')
        print(f"Lyrics line count: {len(lines)}")
        print("First 2 stanzas:")
        print("\n".join(lines[:6]))
        print("Last 2 stanzas:")
        print("\n".join(lines[-6:]))
else:
    print("Kalam not found in DB!")
