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
    
    print(f"Connecting to {supabase_url}...")
    supabase = create_client(supabase_url, supabase_key)
    
    try:
        print("Attempting to insert test author...")
        res = supabase.table("authors").insert({
            "name_roman": "Test Author",
            "name_urdu": "ٹیسٹ شاعر",
            "bio": "This is a test bio"
        }).execute()
        print("Success! Inserted author:", res.data)
        
        # Clean up
        if res.data:
            author_id = res.data[0]["id"]
            print("Cleaning up test author...")
            supabase.table("authors").delete().eq("id", author_id).execute()
            print("Cleanup successful.")
    except Exception as e:
        print("Error during insert:", e)

if __name__ == "__main__":
    main()
