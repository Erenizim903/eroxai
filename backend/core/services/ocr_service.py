import base64
import io
import fitz
from PIL import Image
from .utils import request_google_vision_text


def image_file_to_base64(file_path):
    with open(file_path, "rb") as file_obj:
        return base64.b64encode(file_obj.read()).decode("utf-8")


def pdf_to_images_base64(file_path, zoom=2):
    pdf_document = fitz.open(file_path)
    images = []
    for page in pdf_document:
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        images.append(base64.b64encode(buffer.getvalue()).decode("utf-8"))
    return images


def run_google_vision_ocr(file_path, file_type, language_hint=None):
    if file_type == "pdf":
        texts = []
        for base64_img in pdf_to_images_base64(file_path):
            text = request_google_vision_text(base64_img, language_hint)
            if text:
                texts.append(text)
        return "\n\n".join(texts).strip()
    return request_google_vision_text(image_file_to_base64(file_path), language_hint)
