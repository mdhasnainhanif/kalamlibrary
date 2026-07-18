import json
import os
import re
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

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

env = load_env()
url = env.get("NEXT_PUBLIC_SUPABASE_URL")
key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

# Get Allama Hasan Raza Khan author ID
author_res = supabase.table("authors").select("id").eq("name_roman", "Allama Hasan Raza Khan").execute()
if not author_res.data:
    print("Error: Allama Hasan Raza Khan author not found!")
    exit(1)
author_id = author_res.data[0]["id"]

# Load extracted JSON data
extracted_path = "public/zoq-e-naat_extracted.json"
if not os.path.exists(extracted_path):
    print("Extracted JSON file not found!")
    exit(1)

with open(extracted_path, 'r', encoding='utf-8') as f:
    blocks = json.load(f)

# Parse blocks statefully into structured Kalams in memory
structured_kalams = []
current_kalam = None

for idx, block in enumerate(blocks):
    belongs_to_new = block.get("belongs_to_new_kalam", False)
    
    if belongs_to_new or current_kalam is None:
        title_roman = block.get("title_roman_english", "").strip()
        title_urdu = block.get("title_urdu", "").strip()
        
        if not title_roman:
            title_roman = f"Kalam Block {len(structured_kalams) + 1}"
        if not title_urdu:
            title_urdu = f"کلام بلاک {len(structured_kalams) + 1}"
            
        current_kalam = {
            "title_roman": title_roman,
            "title_urdu": title_urdu,
            "translations": {
                "urdu": {"title": title_urdu, "lyrics_parts": []},
                "roman_english": {"title": title_roman, "lyrics_parts": []},
                "hindi": {"title": block.get("title_hindi") or title_roman, "lyrics_parts": []},
                "bangla": {"title": block.get("title_bangla") or title_roman, "lyrics_parts": []}
            }
        }
        structured_kalams.append(current_kalam)
        
    # Append lyrics to current kalam
    for lang in ["urdu", "roman_english", "hindi", "bangla"]:
        lyrics_val = block.get(f"lyrics_{lang}")
        if lyrics_val and lyrics_val.strip():
            current_kalam["translations"][lang]["lyrics_parts"].append(lyrics_val.strip())

print(f"Parsed {len(structured_kalams)} separate Kalams from JSON.")

# We assume the user has run the SQL DELETE command to clear existing Kalams, so we do not attempt to delete here.

# Insert the structured Kalams one by one to ensure unique slugs and correct ordering
seen_slugs = set()

for idx, kalam in enumerate(structured_kalams):
    title_roman = kalam["title_roman"]
    title_urdu = kalam["title_urdu"]
    
    # Generate unique slug
    kalam_slug = slugify(title_roman)
    if not kalam_slug or kalam_slug == "untitled":
        kalam_slug = slugify(title_urdu)
        
    base_slug = kalam_slug
    counter = 1
    while True:
        # Check in DB
        db_check = supabase.table("kalams").select("id").eq("slug", kalam_slug).execute()
        if not db_check.data and kalam_slug not in seen_slugs:
            break
        counter += 1
        kalam_slug = f"{base_slug}-{counter}"
        
    seen_slugs.add(kalam_slug)
    
    # Insert Kalam record
    new_kalam_res = supabase.table("kalams").insert({
        "author_id": author_id,
        "primary_title_roman": title_roman,
        "primary_title_urdu": title_urdu,
        "slug": kalam_slug
    }).execute()
    
    kalam_db_id = new_kalam_res.data[0]["id"]
    print(f"[{idx+1}/{len(structured_kalams)}] Uploaded Kalam: '{title_roman}' (Slug: {kalam_slug})")
    
    # Insert translations
    for lang, trans_data in kalam["translations"].items():
        lyrics_combined = "\n\n".join(trans_data["lyrics_parts"]).strip()
        if not lyrics_combined:
            continue
            
        supabase.table("kalam_translations").insert({
            "kalam_id": kalam_db_id,
            "language": lang,
            "title": trans_data["title"].strip(),
            "lyrics": lyrics_combined
        }).execute()

print("\nSynchronization completed successfully!")
