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
supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")

supabase = create_client(supabase_url, supabase_key)

kalam_id = "3c9bcc4b-8450-4477-a979-0799d2b9dd19"
up_res = supabase.table("kalams").update({"primary_title_roman": "Kis darja hai roshan tan-e-mehboob-e-Ilah"}).eq("id", kalam_id).execute()

print("UPDATE RESULT DATA:", up_res.data)
