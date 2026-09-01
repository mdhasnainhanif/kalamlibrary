import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"c:\Users\wajiz.pk\OneDrive\Desktop\hasnain\nextjs2\kalamlibrary\public\qabala-e-bakhshish.pdf"
doc = fitz.open(pdf_path)
print(f"Total pages in PDF: {len(doc)}")

# Inspect text on first few pages (1 to 5) and page 19 (index 18)
print("\n--- Page 1-3 Text Snippet ---")
for i in range(min(3, len(doc))):
    print(f"--- Page {i+1} ---")
    print(doc[i].get_text()[:400])

print("\n--- Page 19 (index 18) Text Snippet ---")
if len(doc) >= 19:
    print(doc[18].get_text()[:600])
