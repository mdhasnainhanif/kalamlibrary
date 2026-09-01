import os
import sys
import glob
import json

sys.stdout.reconfigure(encoding='utf-8')

json_files = glob.glob("public/*_extracted.json") + glob.glob("*_extracted.json")

for file_path in set(json_files):
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception:
            continue

    modified = False
    for block in data:
        t_roman = block.get("title_roman_english", "").strip()
        t_urdu = block.get("title_urdu", "").strip()
        
        is_deegar = (
            t_roman.lower() in ["deegar", "digar", "deegar..."] or
            t_urdu in ["دیگر", "دیگر..."]
        )
        
        if is_deegar:
            lyrics_r = block.get("lyrics_roman_english", "").strip()
            lyrics_u = block.get("lyrics_urdu", "").strip()
            
            if lyrics_r:
                first_r = lyrics_r.split("\n")[0].strip()
                if first_r and first_r.lower() not in ["deegar", "digar"]:
                    block["title_roman_english"] = first_r
                    modified = True
            
            if lyrics_u:
                first_u = lyrics_u.split("\n")[0].strip()
                if first_u and first_u not in ["دیگر", "دیگر..."]:
                    block["title_urdu"] = first_u
                    modified = True

            print(f"Updated block in {file_path}: Roman='{block.get('title_roman_english')}', Urdu='{block.get('title_urdu')}'")

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved changes to {file_path}")
