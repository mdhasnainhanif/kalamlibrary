import os
import sys
import json
import time
from pypdf import PdfReader, PdfWriter
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
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
    env = load_env()
    
    gemini_api_key = env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        print("GEMINI_API_KEY not found.")
        sys.exit(1)
        
    from google import genai
    client = genai.Client(api_key=gemini_api_key)
    
    pdf_path = "public/hadaiq-e-bakhshish.pdf"
    reader = PdfReader(pdf_path)
    
    # Slice only page 11 (0-indexed)
    writer = PdfWriter()
    writer.add_page(reader.pages[11])
        
    temp_pdf = "scratch/temp_index.pdf"
    with open(temp_pdf, "wb") as f:
        writer.write(f)
        
    print("Uploading index page 12 to Gemini File API...")
    uploaded_file = client.files.upload(file=temp_pdf)
    
    while str(uploaded_file.state).upper() == "PROCESSING":
        print("Processing...")
        time.sleep(2)
        uploaded_file = client.files.get(name=uploaded_file.name)
        
    print("Sending index transcription request to gemini-2.0-flash...")
    
    prompt = """
    Analyze the attached index (Fahrist) page of the Naat book.
    Extract the list of all Kalams/Naats in the index.
    For each entry, extract:
    1. The title of the Kalam in Urdu.
    2. The page number printed next to it in the index.
    
    Return a JSON array of objects:
    [
      {
        "title_urdu": "Title in Urdu",
        "page_number": 15
      }
    ]
    Provide ONLY valid JSON.
    """
    
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[uploaded_file, prompt],
        config={"response_mime_type": "application/json"}
    )
    
    raw_text = response.text.strip()
    print("Gemini response:")
    print(raw_text)
    
    with open("scratch/index_part_1.json", "w", encoding="utf-8") as out:
        out.write(raw_text)
        
    client.files.delete(name=uploaded_file.name)
    if os.path.exists(temp_pdf):
        os.remove(temp_pdf)

if __name__ == "__main__":
    main()
