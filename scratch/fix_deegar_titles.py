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

def clean_title(text):
    # Remove leading/trailing non-alphanumeric or quotes if any
    return text.strip()

env = load_env()
supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    print("Missing Supabase env vars.")
    sys.exit(1)

supabase = create_client(supabase_url, supabase_key)

# 1. Fetch all kalams where primary_title_roman or primary_title_urdu equals or starts with Deegar / دیگر
res = supabase.table("kalams").select("id, slug, primary_title_roman, primary_title_urdu").execute()

count = 0
for kalam in res.data:
    r_title = kalam['primary_title_roman'] or ''
    u_title = kalam['primary_title_urdu'] or ''
    
    is_deegar = (
        r_title.lower().strip() in ['deegar', 'digar', 'deegar...'] or
        r_title.lower().strip().startswith('deegar-') or
        u_title.strip() in ['دیگر', 'دیگر...'] or
        'deegar' in kalam['slug']
    )
    
    if not is_deegar:
        continue

    print(f"\nProcessing Deegar Kalam ID: {kalam['id']} (Current Slug: {kalam['slug']})")

    # Fetch translations for this kalam
    t_res = supabase.table("kalam_translations").select("id, language, title, lyrics").eq("kalam_id", kalam['id']).execute()
    translations = {t['language']: t for t in t_res.data}

    # Extract first line for roman_english
    new_roman_title = None
    if 'roman_english' in translations and translations['roman_english']['lyrics']:
        first_line = translations['roman_english']['lyrics'].strip().split('\n')[0].strip()
        if first_line and first_line.lower() not in ['deegar', 'digar']:
            new_roman_title = first_line

    # Extract first line for urdu
    new_urdu_title = None
    if 'urdu' in translations and translations['urdu']['lyrics']:
        first_line = translations['urdu']['lyrics'].strip().split('\n')[0].strip()
        if first_line and first_line not in ['دیگر', 'دیگر...']:
            new_urdu_title = first_line

    # Fallback if needed
    if not new_roman_title and new_urdu_title:
        new_roman_title = new_urdu_title
    if not new_urdu_title and new_roman_title:
        new_urdu_title = new_roman_title

    if not new_roman_title:
        print(f"Skipping Kalam ID {kalam['id']} - could not extract new title.")
        continue

    new_slug = slugify(new_roman_title)
    if not new_slug:
        new_slug = slugify(new_urdu_title)

    print(f"  --> New Title Roman: '{new_roman_title}'")
    print(f"  --> New Title Urdu: '{new_urdu_title}'")
    print(f"  --> New Slug: '{new_slug}'")

    # Update kalams table
    supabase.table("kalams").update({
        "primary_title_roman": new_roman_title,
        "primary_title_urdu": new_urdu_title,
        "slug": new_slug
    }).eq("id", kalam['id']).execute()

    # Update translations table for each language
    for lang, t_data in translations.items():
        lang_title = new_roman_title
        if lang == 'urdu' and new_urdu_title:
            lang_title = new_urdu_title
        elif lang == 'hindi' and t_data['lyrics']:
            first_line = t_data['lyrics'].strip().split('\n')[0].strip()
            if first_line and first_line not in ['दीगर', 'दीगर...']:
                lang_title = first_line
        elif lang == 'bangla' and t_data['lyrics']:
            first_line = t_data['lyrics'].strip().split('\n')[0].strip()
            if first_line and first_line not in ['দিগার', 'দীগর']:
                lang_title = first_line

        supabase.table("kalam_translations").update({
            "title": lang_title
        }).eq("id", t_data['id']).execute()
        print(f"  Updated {lang} translation title to '{lang_title}'")

    count += 1

print(f"\nSuccessfully updated {count} Kalams!")
