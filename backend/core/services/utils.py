import base64
import re
import requests
from core.models import SiteSettings
import dns.resolver
from django.conf import settings


def validate_email_domain(email):
    domain = email.split("@")[-1]
    try:
        dns.resolver.resolve(domain, "MX")
        return True
    except Exception:
        return False


def extract_base64(data_url):
    if not data_url:
        return None
    match = re.match(r"^data:image/[^;]+;base64,(.*)$", data_url)
    return match.group(1) if match else data_url


def _get_google_vision_key():
    site_settings = SiteSettings.objects.first()
    if site_settings and site_settings.google_vision_api_key:
        return site_settings.google_vision_api_key
    return settings.GOOGLE_VISION_API_KEY


def request_google_vision_text(base64_image, language_hint=None):
    api_key = _get_google_vision_key()
    if not api_key:
        raise ValueError("GOOGLE_VISION_API_KEY is missing")

    payload = {
        "requests": [
            {
                "image": {"content": base64_image},
                "features": [{"type": "TEXT_DETECTION"}],
            }
        ]
    }

    if language_hint:
        payload["requests"][0]["imageContext"] = {"languageHints": [language_hint]}

    response = requests.post(
        f"https://vision.googleapis.com/v1/images:annotate?key={api_key}",
        json=payload,
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("responses", [{}])[0].get("fullTextAnnotation", {}).get("text", "")
