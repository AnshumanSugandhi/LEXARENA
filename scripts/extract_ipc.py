import pdfplumber

PDF_PATH = "a202345.pdf"
OUTPUT_TXT = "ipc_raw.txt"

all_text = []

with pdfplumber.open(PDF_PATH) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            all_text.append(text)

with open(OUTPUT_TXT, "w", encoding="utf-8") as f:
    f.write("\n".join(all_text))

print("✅ Raw IPC text extracted to ipc_raw.txt")
