import json
import os

extracted_path = "public/zoq-e-naat_extracted.json"
progress_path = "public/zoq-e-naat_progress_stateful.json"

if not os.path.exists(extracted_path):
    print("Extracted JSON file not found!")
    exit(1)

with open(extracted_path, 'r', encoding='utf-8') as f:
    extracted_data = json.load(f)

print("Total extracted blocks:", len(extracted_data))

# Let's count how many blocks are marked as belongs_to_new_kalam
new_kalam_blocks = [b for b in extracted_data if b.get("belongs_to_new_kalam")]
continuation_blocks = [b for b in extracted_data if not b.get("belongs_to_new_kalam")]

print("New Kalam blocks:", len(new_kalam_blocks))
print("Continuation blocks:", len(continuation_blocks))

# Let's check if any titles are empty or weird
import sys
for idx, b in enumerate(new_kalam_blocks[:10]):
    text = f"New Kalam {idx+1}: {b.get('title_roman_english')} | {b.get('title_urdu')}\n"
    sys.stdout.buffer.write(text.encode('utf-8'))

# Let's list the processed ranges from progress file
if os.path.exists(progress_path):
    with open(progress_path, 'r') as f:
        ranges = json.load(f)
    print("Processed ranges:", ranges)
    # Check if there are any gaps in the ranges between 20 and 320
    processed_pages = []
    for r in ranges:
        start, end = map(int, r.split('-'))
        processed_pages.extend(range(start, end + 1))
    
    all_expected_pages = set(range(20, 321))
    missing_pages = all_expected_pages - set(processed_pages)
    print("Missing physical pages from progress tracking:", sorted(list(missing_pages)))
else:
    print("Progress state file not found!")
