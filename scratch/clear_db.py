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

def main():
    env = load_env()
    supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    supabase = create_client(supabase_url, supabase_key)
    
    print("Clearing kalam_translations...")
    supabase.table("kalam_translations").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    print("Clearing kalams...")
    supabase.table("kalams").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    print("Clearing authors...")
    supabase.table("authors").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    print("Database cleared successfully!")

if __name__ == "__main__":
    main()
