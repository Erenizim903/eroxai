import requests
from django.conf import settings
from core.models import SiteSettings


def translate_text(text, source, target, model=None):
    site_settings = SiteSettings.objects.first()
    api_key = site_settings.openai_api_key if site_settings and site_settings.openai_api_key else settings.OPENAI_API_KEY
    if not api_key:
        raise ValueError("OPENAI_API_KEY is missing")
    if not text.strip():
        return ""

    model = model or settings.OPENAI_MODEL
    system_prompt = (
        "You are a professional translator. Translate the input text exactly and only output the translated text."
    )

    response = requests.post(
        "https://api.openai.com/v1/responses",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={
            "model": model,
            "input": [
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": f"Source language: {source}\nTarget language: {target}\n\nText:\n{text}",
                },
            ],
        },
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("output", [{}])[0].get("content", [{}])[0].get("text", data.get("output_text", ""))
