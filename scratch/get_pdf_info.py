import os
from pypdf import PdfReader
import fitz

pdf_path = "public/wasail-e-bakhshish.pdf"
if not os.path.exists(pdf_path):
    print("PDF not found!")
    exit(1)

reader = PdfReader(pdf_path)
total_pages = len(reader.pages)
print(f"Total pages: {total_pages}")

# Render page 1, 74, 75
doc = fitz.open(pdf_path)
for p in [0, 73, 74, 75]:
    if p < total_pages:
        page = doc.load_page(p)
        pix = page.get_pixmap(dpi=150)
        img_path = f"temp_wasail_page_{p+1}.png"
        pix.save(img_path)
        print(f"Saved {img_path}")
doc.close()
