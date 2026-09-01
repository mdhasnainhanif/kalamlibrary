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
supabase = create_client(env["NEXT_PUBLIC_SUPABASE_URL"], env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"])

# Test insert translation and delete translation
t_ins = supabase.table("kalam_translations").insert({
    "kalam_id": "156c3a37-591d-4a57-81a6-487859ec731e", # dummy or test kalam_id
    "language": "roman_english",
    "title": "Test Trans Title",
    "lyrics": "Test Lyrics Line 1\nTest Lyrics Line 2"
}).execute()
print("TRANS INSERT RESULT:", t_ins.data)

if t_ins.data:
    t_id = t_ins.data[0]["id"]
    t_up = supabase.table("kalam_translations").update({"title": "Test Trans Updated"}).eq("id", t_id).execute()
    print("TRANS UPDATE RESULT:", t_up.data)
    t_del = supabase.table("kalam_translations").delete().eq("id", t_id).execute()
    print("TRANS DELETE RESULT:", t_del.data)
