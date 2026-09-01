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
supabase = create_client(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"] or env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"])

res = supabase.table("kalams").select("id, slug, primary_title_roman, primary_title_urdu").in_("id", [
    "44527479-f546-4246-b3a3-0cff71b0f479",
    "3c9bcc4b-8450-4477-a979-0799d2b9dd19",
    "830c8017-3a1e-4ad2-8128-5b370f0d787d",
    "7bc38a0f-1a1f-4047-8ac4-828d728c107f",
    "57e7634b-b6c6-4cd9-aace-b9e2b863e01f",
    "56b74bad-b875-483d-8fc0-0dfbfe88af4e",
    "80705963-114a-4bde-a066-7a43da7f4675",
    "e2f5cace-ee11-4a93-a788-3a49b576a2b8"
]).execute()

for k in res.data:
    print(f"ID: {k['id']}, Slug: '{k['slug']}', Roman: '{k['primary_title_roman']}', Urdu: '{k['primary_title_urdu']}'")
