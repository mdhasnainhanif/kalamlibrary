import sys
import os
from pypdf import PdfReader

pdf_path = "c:\\Users\\wajiz.pk\\OneDrive\\Desktop\\hasnain\\nextjs2\\kalamlibrary\\public\\zoq-e-naat.pdf"
if not os.path.exists(pdf_path):
    print("PDF not found at:", pdf_path)
    sys.exit(1)

reader = PdfReader(pdf_path)
print("Total pages:", len(reader.pages))

# Print metadata
print("Metadata:", reader.metadata)

# Let's extract text of page 17 to verify what starts on it
# (remember page 17 in human-speak is usually index 16 or index 17 depending on cover page, let's look at text of index 16 and 17)
print("\n--- PAGE 17 Text (Index 16) ---")
print(reader.pages[16].extract_text()[:400])

print("\n--- PAGE 18 Text (Index 17) ---")
print(reader.pages[17].extract_text()[:400])
