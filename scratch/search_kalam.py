import os
from pypdf import PdfReader

def main():
    pdf_path = "public/hadaiq-e-bakhshish.pdf"
    if not os.path.exists(pdf_path):
        print("PDF not found")
        return
        
    reader = PdfReader(pdf_path)
    print(f"Total pages: {len(reader.pages)}")
    
    # Search in all pages
    target = "جود"
    target2 = "کرم"
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if target in text or target2 in text:
            print(f"Match found in PDF Page {i+1} (0-indexed page {i})")
            # Print a snippet of the page text
            print("Snippet:", text[:200].replace('\n', ' '))

if __name__ == "__main__":
    main()
