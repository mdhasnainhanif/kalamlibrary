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

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

env = load_env()
supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")

supabase = create_client(supabase_url, supabase_key)

# Fetch all kalams with Ayzan / ایضاً
res = supabase.table("kalams").select("id, slug, primary_title_roman, primary_title_urdu, author_id").execute()

ayzan_kalams = []
for k in res.data:
    r_title = (k['primary_title_roman'] or '').strip()
    u_title = (k['primary_title_urdu'] or '').strip()
    if r_title.lower() in ['ayzan', 'aizan'] or u_title in ['ایضاً', 'ایضا', 'اَیضاً'] or 'ayzan' in k['slug'] or 'aizan' in k['slug']:
        ayzan_kalams.append(k)

print(f"Found {len(ayzan_kalams)} Ayzan Kalams to convert to proper titles.")

inserted_count = 0
for k in ayzan_kalams:
    t_res = supabase.table("kalam_translations").select("language, title, lyrics").eq("kalam_id", k['id']).execute()
    translations = {t['language']: t for t in t_res.data}

    new_roman_title = None
    if 'roman_english' in translations and translations['roman_english']['lyrics']:
        first_line = translations['roman_english']['lyrics'].strip().split('\n')[0].strip()
        if first_line and first_line.lower() not in ['ayzan', 'aizan']:
            new_roman_title = first_line

    new_urdu_title = None
    if 'urdu' in translations and translations['urdu']['lyrics']:
        first_line = translations['urdu']['lyrics'].strip().split('\n')[0].strip()
        if first_line and first_line not in ['ایضاً', 'ایضا', 'اَیضاً']:
            new_urdu_title = first_line

    if not new_roman_title and new_urdu_title:
        new_roman_title = new_urdu_title
    if not new_urdu_title and new_roman_title:
        new_urdu_title = new_roman_title

    if not new_roman_title:
        continue

    new_slug = slugify(new_roman_title)

    existing = supabase.table("kalams").select("id").eq("slug", new_slug).execute()
    if existing.data:
        continue

    print(f"Re-inserting Ayzan Kalam -> Roman: '{new_roman_title}', Urdu: '{new_urdu_title}'")

    new_kalam_res = supabase.table("kalams").insert({
        "author_id": k["author_id"],
        "primary_title_roman": new_roman_title,
        "primary_title_urdu": new_urdu_title,
        "slug": new_slug
    }).execute()

    if new_kalam_res.data:
        new_kalam_id = new_kalam_res.data[0]["id"]

        for lang, t_data in translations.items():
            lang_title = new_roman_title
            if lang == 'urdu' and new_urdu_title:
                lang_title = new_urdu_title
            elif lang == 'hindi' and t_data['lyrics']:
                first_line = t_data['lyrics'].strip().split('\n')[0].strip()
                if first_line and first_line not in ['ऐज़न', 'ऐज़न...']:
                    lang_title = first_line
            elif lang == 'bangla' and t_data['lyrics']:
                first_line = t_data['lyrics'].strip().split('\n')[0].strip()
                if first_line and first_line not in ['আইজান']:
                    lang_title = first_line

            supabase.table("kalam_translations").insert({
                "kalam_id": new_kalam_id,
                "language": lang,
                "title": lang_title,
                "lyrics": t_data["lyrics"]
            }).execute()

        inserted_count += 1

print(f"Converted {inserted_count} Ayzan Kalams to proper titles!")
