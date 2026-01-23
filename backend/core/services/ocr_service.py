import base64
import io
import logging
from PIL import Image
from .utils import request_google_vision_text

logger = logging.getLogger(__name__)


def image_file_to_base64(file_path):
    with open(file_path, "rb") as file_obj:
        return base64.b64encode(file_obj.read()).decode("utf-8")


def pdf_to_images_base64(file_path, zoom=2):
    try:
        import fitz
    except ImportError as exc:
        raise ImportError("PyMuPDF (fitz) is required for PDF OCR.") from exc
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


def _normalize_tesseract_language(language_hint):
    if not language_hint:
        return "eng"
    mapping = {
        "eng": "eng",
        "en": "eng",
        "tur": "tur",
        "tr": "tur",
        "jpn": "jpn",
        "ja": "jpn",
    }
    return mapping.get(language_hint, language_hint)


def run_free_ocr_from_image(image, language_hint=None):
    try:
        import pytesseract
    except ImportError:
        logger.warning("pytesseract is not installed; free OCR fallback skipped.")
        return ""
    lang = _normalize_tesseract_language(language_hint)
    try:
        return pytesseract.image_to_string(image, lang=lang).strip()
    except Exception as exc:
        logger.warning("Free OCR fallback failed: %s", exc)
        return ""


def run_free_ocr_from_base64(base64_image, language_hint=None):
    try:
        raw = base64.b64decode(base64_image)
        image = Image.open(io.BytesIO(raw))
    except Exception as exc:
        logger.warning("Free OCR fallback decode failed: %s", exc)
        return ""
    return run_free_ocr_from_image(image, language_hint)


def run_google_vision_ocr(file_path, file_type, language_hint=None):
    if file_type == "pdf":
        texts = []
        for base64_img in pdf_to_images_base64(file_path):
            try:
                text = request_google_vision_text(base64_img, language_hint)
            except Exception as exc:
                logger.warning("Google Vision OCR failed, using free OCR fallback: %s", exc)
                text = run_free_ocr_from_base64(base64_img, language_hint)
            if text:
                texts.append(text)
        return "\n\n".join(texts).strip()
    base64_img = image_file_to_base64(file_path)
    try:
        return request_google_vision_text(base64_img, language_hint)
    except Exception as exc:
        logger.warning("Google Vision OCR failed, using free OCR fallback: %s", exc)
        return run_free_ocr_from_base64(base64_img, language_hint)
