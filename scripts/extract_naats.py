import os
import sys
import re
import json
import time
import argparse
import socket
import fitz
from PIL import Image
from pypdf import PdfReader, PdfWriter
from supabase import create_client

# Set global socket timeout to 60 seconds to prevent network requests from hanging forever
socket.setdefaulttimeout(60)

# Simple environment loader to parse .env and .env.local
def load_env():
    env = {}
    # Load .env first, then override with .env.local
    for file in ['.env', '.env.local']:
        if os.path.exists(file):
            print(f"Loading env from {file}...")
            with open(file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line and not line.startswith('#'):
                        key, val = line.split('=', 1)
                        # Strip spaces and optional quotes
                        env[key.strip()] = val.strip().strip("'").strip('"')
    return env

# Helper to slugify titles safely
def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

def clean_and_parse_json(text):
    text = text.strip()
    
    # Remove markdown code fences if present
    if text.startswith("```"):
        lines = text.split("\n")
        if lines[0].startswith("```json") or lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
        
    # Standard JSON parse attempt
    try:
        return json.loads(text)
    except Exception:
        pass
        
    # Attempt to extract matching bracketed array using regex
    match = re.search(r'\[\s*\{.*\}\s*\]', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass
            
    # Attempt to extract matching bracketed object using regex
    match_obj = re.search(r'\{\s*".*\}\s*', text, re.DOTALL)
    if match_obj:
        try:
            return json.loads(match_obj.group(0))
        except Exception:
            pass

    # Count open/close brackets to extract array/object precisely
    for start_char, end_char in [('[', ']'), ('{', '}')]:
        start = text.find(start_char)
        if start != -1:
            count = 0
            for i in range(start, len(text)):
                if text[i] == start_char:
                    count += 1
                elif text[i] == end_char:
                    count -= 1
                    if count == 0:
                        try:
                            return json.loads(text[start:i+1])
                        except Exception:
                            break
                            
    raise Exception(f"Failed to parse a valid JSON array or object from model output. Raw output length: {len(text)}")

# Main extraction function
def main():
    # Force stdout and stderr to use UTF-8 on Windows terminal
    if sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    if sys.stderr.encoding != 'utf-8':
        try:
            sys.stderr.reconfigure(encoding='utf-8')
        except Exception:
            pass

    env = load_env()
    
    # Retrieve configuration
    supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    # Python script needs the service role key or anon key to write to Supabase.
    # We first try service role key (if they set it up), then fallback to publishable/anon key.
    supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    gemini_api_key = env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")

    if not supabase_url or not supabase_key:
        print("ERROR: Supabase URL or Key not found in .env/.env.local.")
        print("Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.")
        sys.exit(1)
        
    if not gemini_api_key:
        print("ERROR: GEMINI_API_KEY not found in environment or env files.")
        print("Please set GEMINI_API_KEY in .env.local or your OS environment variables.")
        print("You can get a free key from Google AI Studio: https://aistudio.google.com/")
        sys.exit(1)

    # Initialize Supabase client
    print(f"Connecting to Supabase at {supabase_url}...")
    supabase = create_client(supabase_url, supabase_key)
    
    # Import google-genai here so that pip dependencies are verified
    try:
        from google import genai
    except ImportError:
        print("ERROR: google-genai library is not installed. Run 'pip install google-genai'")
        sys.exit(1)

    client = genai.Client(api_key=gemini_api_key)

    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Extract Naats from PDF using Gemini API")
    parser.add_argument("--pdf", help="Path to PDF file")
    parser.add_argument("--start", type=int, help="Start page (1-based)")
    parser.add_argument("--end", type=int, help="End page (1-based)")
    parser.add_argument("--chunk", type=int, default=5, help="Page chunk size for processing")
    parser.add_argument("--author", default="Imam Ahmad Raza Khan Qadri", help="Author of the collection")
    parser.add_argument("--non-interactive", action="store_true", help="Run without prompting on errors or questions")
    args = parser.parse_args()

    pdf_path = args.pdf
    if not pdf_path:
        pdf_path = input("Enter path to PDF (e.g. C:\\Users\\wajiz.pk\\Downloads\\dewan-e-salik.pdf): ").strip()
    
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        sys.exit(1)

    reader = PdfReader(pdf_path)
    total_pages = len(reader.pages)
    print(f"Loaded PDF with {total_pages} pages.")

    start_page = args.start
    if start_page is None:
        start_page = int(input(f"Enter start page (1 to {total_pages}): ").strip())
    start_page = start_page - 1  # 0-indexed internally

    end_page = args.end
    if end_page is None:
        end_page = int(input(f"Enter end page ({start_page + 1} to {total_pages}): ").strip())

    chunk_size = args.chunk
    if chunk_size is None or (args.chunk == 5 and not args.pdf):
        chunk_input = input("Enter page chunk size for processing [5]: ").strip()
        chunk_size = int(chunk_input) if chunk_input else 5

    # Path to track progress
    progress_file = os.path.splitext(pdf_path)[0] + "_progress_stateful.json"
    processed_ranges = []
    if os.path.exists(progress_file):
        try:
            with open(progress_file, 'r') as f:
                processed_ranges = json.load(f)
            print(f"Loaded existing progress from {progress_file}. Already processed pages: {processed_ranges}")
        except Exception:
            pass

    # Stateful tracking of active Kalam across pages
    state_file = os.path.splitext(pdf_path)[0] + "_state.json"
    crawler_state = {"active_kalam_id": None, "active_kalam_title_roman": None}
    if os.path.exists(state_file):
        try:
            with open(state_file, 'r', encoding='utf-8') as f:
                crawler_state = json.load(f)
            print(f"Loaded active crawling state: {crawler_state}")
        except Exception:
            pass

    current_start = start_page
    while current_start < end_page:
        current_end = min(current_start + chunk_size, end_page)
        
        # Check if already processed
        range_str = f"{current_start + 1}-{current_end}"
        if range_str in processed_ranges:
            print(f"Skipping pages {range_str} (already processed)")
            current_start = current_end
            continue
            
        print(f"\n==============================")
        print(f"Processing pages {current_start + 1} to {current_end}...")
        print(f"==============================")

        # 1. Render PDF page(s) to temporary PNG images
        temp_images = []
        doc = fitz.open(pdf_path)
        for i in range(current_start, current_end):
            page = doc.load_page(i)
            pix = page.get_pixmap(dpi=150)
            img_path = f"temp_page_{i}.png"
            pix.save(img_path)
            temp_images.append(img_path)
        doc.close()

        max_attempts = 5
        attempt = 0
        success = False
        naats_data = []

        while attempt < max_attempts and not success:
            attempt += 1
            try:
                # 2. Load images into PIL.Image objects
                pil_images = [Image.open(path) for path in temp_images]
                
                # 3. Call Gemini Model to extract lyrics
                print("Sending request to Gemini 2.0 Flash...")
                prompt = f"""
                 You are a professional scribe transcribing Islamic Naats and Sufi Kalam from printed pages.
                 Analyze the attached page images (PDF Pages {current_start + 1} to {current_end}). They contain printed Urdu poetry.
                 
                 YOUR MISSION:
                 You must transcribe EVERY SINGLE line and couplet (she'r) printed on the pages literally, line-by-line, without skipping a single word.
                 
                 RULES FOR CONTENT SEGMENTATION:
                 A poetry page might contain:
                 - A continuation of a Kalam started on a previous page (no bold title is printed for it here).
                 - A new Kalam starting with a bold heading/title.
                 - Both (a continuation at the top, followed by a new Kalam starting with a bold title in the middle or bottom).
                 
                 Separate the content on these pages into sequential blocks as they appear from top to bottom.
                 
                 - If a block is a continuation of the previous Kalam (it has no bold title heading on these pages):
                   - Set "belongs_to_new_kalam": false.
                   - Set title fields to empty strings.
                   
                 - If a block starts a new Kalam on these pages (marked by a bold heading/title):
                   - Set "belongs_to_new_kalam": true.
                   - Extract the title in Urdu Unicode, Roman English, Hindi, and Bangla.
                 
                 For each block, transcribe:
                 - "lyrics_urdu": Every single Urdu line literally in Urdu Unicode (Nastaliq), stanza-by-stanza (double newlines between stanzas).
                 - "lyrics_roman_english": Every line transliterated into Roman English, matched stanza-by-stanza.
                 - "lyrics_hindi": Every line transliterated into Hindi, matched stanza-by-stanza.
                 - "lyrics_bangla": Every line transliterated into Bengali, matched stanza-by-stanza.
                 - "author_name": "{args.author}"
                 
                 Return a JSON object with this structure:
                 {{
                   "blocks": [
                     {{
                       "belongs_to_new_kalam": true,
                       "title_urdu": "Title in Urdu",
                       "title_roman_english": "Title in Roman",
                       "title_hindi": "Title in Hindi",
                       "title_bangla": "Title in Bangla",
                       "lyrics_urdu": "lyrics lines...",
                       "lyrics_roman_english": "lyrics lines...",
                       "lyrics_hindi": "lyrics lines...",
                       "lyrics_bangla": "lyrics lines...",
                       "author_name": "{args.author}"
                     }}
                   ]
                 }}
                 Provide ONLY the raw JSON object. Do not wrap in markdown or add commentary.
                 """
 
                response = client.models.generate_content(
                    model="gemini-3.1-flash-lite", # Use standard Gemini 3.1 Flash Lite
                    contents=pil_images + [prompt],
                    config={"response_mime_type": "application/json"}
                )
                
                raw_text = response.text.strip()
                
                # 4. Parse response
                parsed_data = clean_and_parse_json(raw_text)
                naats_data = parsed_data.get("blocks", []) if isinstance(parsed_data, dict) else parsed_data
                success = True
            except Exception as api_err:
                print(f"Warning: API Attempt {attempt} failed: {api_err}")
                
                if attempt < max_attempts:
                    if "RESOURCE_EXHAUSTED" in str(api_err):
                        print("Rate limit hit. Waiting 60 seconds to clear quota bucket...")
                        time.sleep(60)
                    else:
                        sleep_time = 10 * attempt
                        print(f"Waiting {sleep_time} seconds before retrying...")
                        time.sleep(sleep_time)
                else:
                    raise api_err
 
        try:
            print(f"Extracted {len(naats_data)} Kalam blocks from current chunk.")
 
            # 5. Local JSON Backup
            backup_file = os.path.splitext(pdf_path)[0] + "_extracted.json"
            all_extracted = []
            if os.path.exists(backup_file):
                try:
                    with open(backup_file, 'r', encoding='utf-8') as f:
                        all_extracted = json.load(f)
                except Exception:
                    pass
            all_extracted.extend(naats_data)
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(all_extracted, f, indent=2, ensure_ascii=False)
            print(f"Saved local backup of {len(naats_data)} blocks to: {backup_file}")
 
            # 6. Insert into Supabase (Statefully appends continuations)
            for naat in naats_data:
                belongs_to_new = naat.get("belongs_to_new_kalam", False)
                roman_title = naat.get("title_roman_english", "").strip()
                urdu_title = naat.get("title_urdu", "").strip()
                author_name = naat.get("author_name", args.author).strip()
                
                try:
                    # Check/Insert Author (query by name_roman)
                    author_res = supabase.table("authors").select("id").eq("name_roman", author_name).execute()
                    if author_res.data:
                        author_id = author_res.data[0]["id"]
                    else:
                        print(f"Adding new author: {author_name}")
                        new_author = supabase.table("authors").insert({
                            "name_roman": author_name,
                            "name_urdu": author_name, # Fallback
                            "bio": f"Poet of Kalam, including writings from classic collections."
                        }).execute()
                        author_id = new_author.data[0]["id"]
 
                    # State transition logic
                    if belongs_to_new or not crawler_state.get("active_kalam_id"):
                        if not roman_title:
                            roman_title = f"Kalam Page {current_start + 1}"
                        if not urdu_title:
                            urdu_title = f"کلام صفحہ {current_start + 1}"
 
                        kalam_slug = slugify(roman_title)
                        if not kalam_slug or kalam_slug == "untitled":
                            kalam_slug = slugify(urdu_title)
 
                        kalam_res = supabase.table("kalams").select("id").eq("slug", kalam_slug).execute()
                        if kalam_res.data:
                            kalam_id = kalam_res.data[0]["id"]
                            print(f"New block Kalam '{roman_title}' already exists. Re-linking...")
                        else:
                            print(f"Creating new Kalam: {roman_title}")
                            new_kalam = supabase.table("kalams").insert({
                                "author_id": author_id,
                                "primary_title_roman": roman_title,
                                "primary_title_urdu": urdu_title,
                                "slug": kalam_slug
                            }).execute()
                            kalam_id = new_kalam.data[0]["id"]
 
                        # Update crawler active state
                        crawler_state["active_kalam_id"] = kalam_id
                        crawler_state["active_kalam_title_roman"] = roman_title
                        with open(state_file, 'w', encoding='utf-8') as sf:
                            json.dump(crawler_state, sf)
                    else:
                        kalam_id = crawler_state["active_kalam_id"]
                        roman_title = crawler_state["active_kalam_title_roman"]
                        print(f"Appending verses to ongoing Kalam: '{roman_title}'")
 
                    # Insert / update translations
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
                            
                            # Append new lyrics only if they are not already contained in the existing database entry
                            if new_lyrics and (new_lyrics not in existing_lyrics):
                                if existing_lyrics.strip():
                                    merged_lyrics = existing_lyrics.strip() + "\n\n" + new_lyrics
                                else:
                                    merged_lyrics = new_lyrics
                                payload["lyrics"] = merged_lyrics
                            else:
                                payload["lyrics"] = existing_lyrics
                                
                            supabase.table("kalam_translations")\
                                .update(payload)\
                                .eq("id", trans_res.data[0]["id"])\
                                .execute()
                        else:
                            supabase.table("kalam_translations")\
                                .insert(payload)\
                                .execute()
                except Exception as db_err:
                    print(f"Warning: Failed to insert '{roman_title}' into Supabase: {db_err}")
                    print("Make sure your database schema is applied. The local JSON backup is safe.")

            # Record progress
            processed_ranges.append(range_str)
            with open(progress_file, 'w') as f:
                json.dump(processed_ranges, f)
            print(f"Successfully processed pages {range_str} and saved progress.")

        except Exception as e:
            print(f"ERROR processing range {range_str}: {e}")
            if args.non_interactive:
                print("Skipping this chunk and moving forward (non-interactive mode)...")
            else:
                # Ask if they want to continue or retry
                choice = input("Failed. Do you want to retry this chunk? (y/n): ").strip().lower()
                if choice == 'y':
                    continue # loop will repeat the same range
                else:
                    print("Skipping this chunk and moving forward...")

        # Clean up temp images
        for path in temp_images:
            if os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass

        current_start = current_end
        # Cool-down to prevent aggressive rate limits on free tier
        time.sleep(15)

    print("\nExtraction process completed!")

if __name__ == "__main__":
    main()
