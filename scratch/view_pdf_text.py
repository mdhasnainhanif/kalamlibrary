import os
from pypdf import PdfReader

def main():
    pdf_path = "public/hadaiq-e-bakhshish.pdf"
    if not os.path.exists(pdf_path):
        print("PDF file not found.")
        return
        
    reader = PdfReader(pdf_path)
    print(f"Total pages: {len(reader.pages)}")
    
    out_file = "scratch/pdf_text_dump.txt"
    with open(out_file, "w", encoding="utf-8") as out:
        for page_num in range(13, 35):
            out.write(f"\n--- PAGE {page_num + 1} ---\n")
            text = reader.pages[page_num].extract_text()
            out.write(text)
    print("SUCCESS: Text dumped to", out_file)

if __name__ == "__main__":
    main()
