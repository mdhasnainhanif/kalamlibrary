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

authors = supabase.table("authors").select("id").limit(1).execute()
author_id = authors.data[0]["id"]

ins = supabase.table("kalams").insert({
    "author_id": author_id,
    "primary_title_roman": "Test Title XYZ",
    "primary_title_urdu": "ٹیسٹ عنوان",
    "slug": "test-title-xyz-123"
}).execute()
print("INSERT RESULT:", ins.data)

if ins.data:
    t_id = ins.data[0]["id"]
    up = supabase.table("kalams").update({"primary_title_roman": "Test Title Updated"}).eq("id", t_id).execute()
    print("UPDATE RESULT:", up.data)
    dele = supabase.table("kalams").delete().eq("id", t_id).execute()
    print("DELETE RESULT:", dele.data)
