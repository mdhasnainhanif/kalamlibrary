import os
import sys
import re
import json
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

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/sync_db.py <path_to_extracted_json> [default_author_name]")
        sys.exit(1)

    json_path = sys.argv[1]
    default_author = sys.argv[2] if len(sys.argv) > 2 else "Imam Ahmad Raza Khan Qadri"

    if not os.path.exists(json_path):
        print(f"File not found: {json_path}")
        sys.exit(1)

    with open(json_path, 'r', encoding='utf-8') as f:
        blocks = json.load(f)

    env = load_env()
    supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        print("ERROR: Supabase credentials not found in env.")
        sys.exit(1)

    print(f"Connecting to Supabase at {supabase_url}...")
    supabase = create_client(supabase_url, supabase_key)

    active_kalam_id = None
    active_kalam_title_roman = None

    for idx, naat in enumerate(blocks):
        belongs_to_new = naat.get("belongs_to_new_kalam", False)
        roman_title = naat.get("title_roman_english", "").strip()
        urdu_title = naat.get("title_urdu", "").strip()
        author_name = naat.get("author_name", default_author).strip()

        # If title is Deegar / دیگر, replace with first line of lyrics
        if roman_title.lower() in ["deegar", "digar", "deegar..."] or urdu_title in ["دیگر", "دیگر..."]:
            lyrics_r = naat.get("lyrics_roman_english", "").strip()
            lyrics_u = naat.get("lyrics_urdu", "").strip()
            if lyrics_r and lyrics_r.split("\n")[0].strip().lower() not in ["deegar", "digar"]:
                roman_title = lyrics_r.split("\n")[0].strip()
            if lyrics_u and lyrics_u.split("\n")[0].strip() not in ["دیگر", "دیگر..."]:
                urdu_title = lyrics_u.split("\n")[0].strip()

        print(f"\nProcessing block {idx + 1}/{len(blocks)}: '{roman_title}' (New: {belongs_to_new})")

        # 1. Ensure author exists
        author_res = supabase.table("authors").select("id").eq("name_roman", author_name).execute()
        if author_res.data:
            author_id = author_res.data[0]["id"]
        else:
            print(f"Adding new author: {author_name}")
            new_author = supabase.table("authors").insert({
                "name_roman": author_name,
                "name_urdu": author_name,
                "bio": "Poet of Kalam, including writings from classic collections."
            }).execute()
            author_id = new_author.data[0]["id"]

        # 2. Get or create Kalam record
        if belongs_to_new or not active_kalam_id:
            if not roman_title:
                roman_title = f"Kalam Block {idx + 1}"
            if not urdu_title:
                urdu_title = f"کلام بلاک {idx + 1}"

            kalam_slug = slugify(roman_title)
            if not kalam_slug or kalam_slug == "untitled":
                kalam_slug = slugify(urdu_title)

            kalam_res = supabase.table("kalams").select("id").eq("slug", kalam_slug).execute()
            if kalam_res.data:
                kalam_id = kalam_res.data[0]["id"]
                print(f"Kalam '{roman_title}' already exists. ID: {kalam_id}")
            else:
                print(f"Creating new Kalam: {roman_title}")
                new_kalam = supabase.table("kalams").insert({
                    "author_id": author_id,
                    "primary_title_roman": roman_title,
                    "primary_title_urdu": urdu_title,
                    "slug": kalam_slug
                }).execute()
                kalam_id = new_kalam.data[0]["id"]

            active_kalam_id = kalam_id
            active_kalam_title_roman = roman_title
        else:
            kalam_id = active_kalam_id
            roman_title = active_kalam_title_roman
            print(f"Appending verses to ongoing Kalam: '{roman_title}'")

        # 3. Synchronize translations
        languages = {
            "urdu": (naat.get("title_urdu") or urdu_title or roman_title, naat.get("lyrics_urdu")),
            "roman_english": (roman_title, naat.get("lyrics_roman_english")),
            "hindi": (naat.get("title_hindi") or roman_title, naat.get("lyrics_hindi")),
            "bangla": (naat.get("title_bangla") or roman_title, naat.get("lyrics_bangla"))
        }

        for lang, (title_val, lyrics_val) in languages.items():
            if not title_val or not lyrics_val:
                continue

            trans_res = supabase.table("kalam_translations")\
                .select("id, lyrics")\
                .eq("kalam_id", kalam_id)\
                .eq("language", lang)\
                .execute()

            payload = {
                "kalam_id": kalam_id,
                "language": lang,
                "title": title_val.strip(),
                "lyrics": lyrics_val.strip()
            }

            if trans_res.data:
                existing_lyrics = trans_res.data[0].get("lyrics") or ""
                new_lyrics = lyrics_val.strip()

                if new_lyrics and (new_lyrics not in existing_lyrics):
                    if existing_lyrics.strip():
                        merged_lyrics = existing_lyrics.strip() + "\n\n" + new_lyrics
                    else:
                        merged_lyrics = new_lyrics
                    payload["lyrics"] = merged_lyrics
                    print(f"Updating and appending {lang} lyrics for '{roman_title}'...")
                    supabase.table("kalam_translations").update(payload).eq("id", trans_res.data[0]["id"]).execute()
                else:
                    # Translation exists and lyrics are already matched
                    pass
            else:
                print(f"Inserting new {lang} lyrics for '{roman_title}'...")
                supabase.table("kalam_translations").insert(payload).execute()

    print("\nSynchronization complete!")

if __name__ == "__main__":
    main()
