import base64
from pathlib import Path
from pypdf import PdfReader


def file_to_base64(file_obj):
    content = file_obj.read()
    return base64.b64encode(content).decode("utf-8")


def extract_text_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
    except Exception:
        return ""


def is_image_file(filename):
    suffix = Path(filename).suffix.lower()
    return suffix in [".png", ".jpg", ".jpeg", ".webp"]
