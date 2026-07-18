import fitz
import sys

pdf_path = "c:\\Users\\wajiz.pk\\OneDrive\Desktop\\hasnain\\nextjs2\\kalamlibrary\\public\\zoq-e-naat.pdf"
doc = fitz.open(pdf_path)

# Let's render page 17 (index 16)
page_idx = 16
page = doc.load_page(page_idx)
pix = page.get_pixmap(dpi=150)
img_path = f"c:\\Users\\wajiz.pk\\OneDrive\\Desktop\\hasnain\\nextjs2\\kalamlibrary\\scratch\\page_{page_idx + 1}.png"
pix.save(img_path)
print(f"Page {page_idx + 1} rendered and saved to: {img_path}")

# Let's render page 16 (index 15) to see what is before it
page_idx_prev = 15
page_prev = doc.load_page(page_idx_prev)
pix_prev = page_prev.get_pixmap(dpi=150)
img_path_prev = f"c:\\Users\\wajiz.pk\\OneDrive\\Desktop\\hasnain\\nextjs2\\kalamlibrary\\scratch\\page_{page_idx_prev + 1}.png"
pix_prev.save(img_path_prev)
print(f"Page {page_idx_prev + 1} rendered and saved to: {img_path_prev}")

doc.close()
