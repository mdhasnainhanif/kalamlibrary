import fitz

pdf_path = "public/wasail-e-bakhshish.pdf"
doc = fitz.open(pdf_path)
total_pages = len(doc)
print(f"Total pages: {total_pages}")

# Print text of first 10 pages and some random pages to see if it's OCR'd
for i in [1, 2, 10, 74, 90, 700]:
    page = doc.load_page(i)
    text = page.get_text()
    print(f"--- Page {i+1} text length: {len(text)} ---")
    if text:
        print(text[:200])

doc.close()
