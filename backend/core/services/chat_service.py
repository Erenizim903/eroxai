import requests
from django.conf import settings
from core.models import SiteSettings


def get_chat_provider_settings():
    """SiteSettings'ten chat provider ayarlarını al"""
    try:
        site_settings = SiteSettings.objects.first()
        if site_settings:
            return {
                'provider': site_settings.chat_provider or 'openai',
                'endpoints': {
                    'openai': site_settings.openai_endpoint or 'https://api.openai.com/v1/chat/completions',
                    'deepseek': site_settings.deepseek_endpoint or 'https://api.deepseek.com/v1/chat/completions',
                    'blackbox': site_settings.blackbox_endpoint or 'https://www.blackbox.ai/api/chat',
                },
                'keys': {
                    'openai': site_settings.openai_api_key or settings.OPENAI_API_KEY,
                    'deepseek': site_settings.deepseek_api_key or settings.OPENAI_API_KEY,
                    'blackbox': site_settings.blackbox_api_key or '',
                },
            }
    except:
        pass
    return {
        'provider': 'openai',
        'endpoints': {
            'openai': 'https://api.openai.com/v1/chat/completions',
            'deepseek': 'https://api.deepseek.com/v1/chat/completions',
            'blackbox': 'https://www.blackbox.ai/api/chat',
        },
        'keys': {
            'openai': settings.OPENAI_API_KEY,
            'deepseek': settings.OPENAI_API_KEY,
            'blackbox': '',
        },
    }


def chat_with_ai(message, language="tr", provider=None):
    """Multi-provider AI chat bot"""
    if not message.strip():
        return "Lütfen bir soru sorun."
    
    provider_settings = get_chat_provider_settings()
    active_provider = provider or provider_settings['provider']
    endpoint = provider_settings['endpoints'].get(active_provider, provider_settings['endpoints']['openai'])
    api_key = provider_settings['keys'].get(active_provider)
    
    system_prompts = {
        "tr": "Sen EroxAI Studio platformunun yardımcı asistanısın. Kullanıcılara platform hakkında bilgi ver, OCR ve çeviri özelliklerini açıkla. Kısa, net ve yardımcı ol.",
        "en": "You are a helpful assistant for EroxAI Studio platform. Provide information about the platform, explain OCR and translation features. Be brief, clear, and helpful.",
        "ja": "あなたはEroxAI Studioプラットフォームのアシスタントです。プラットフォームについて情報を提供し、OCRと翻訳機能を説明してください。簡潔で明確かつ親切に。",
    }
    
    system_prompt = system_prompts.get(language, system_prompts["tr"])
    
    try:
        if active_provider == 'openai':
            return _chat_openai(endpoint, message, system_prompt, api_key)
        elif active_provider == 'deepseek':
            return _chat_deepseek(endpoint, message, system_prompt, api_key)
        elif active_provider == 'blackbox':
            return _chat_blackbox(endpoint, message, system_prompt, api_key)
        else:
            return _chat_openai(endpoint, message, system_prompt)
    except Exception as e:
        return f"Chat bot şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin. ({str(e)[:50]})"


def _chat_openai(endpoint, message, system_prompt, api_key):
    """OpenAI API çağrısı"""
    if not api_key:
        raise ValueError("OPENAI_API_KEY is missing")
    
    response = requests.post(
        endpoint,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            "max_tokens": 500,
            "temperature": 0.7,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("choices", [{}])[0].get("message", {}).get("content", "Üzgünüm, bir hata oluştu.")


def _chat_deepseek(endpoint, message, system_prompt, api_key):
    """DeepSeek API çağrısı"""
    if not api_key:
        raise ValueError("API_KEY is missing for DeepSeek")
    
    response = requests.post(
        endpoint,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            "max_tokens": 500,
            "temperature": 0.7,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("choices", [{}])[0].get("message", {}).get("content", "Üzgünüm, bir hata oluştu.")


def _chat_blackbox(endpoint, message, system_prompt, api_key=None):
    """Blackbox API çağrısı"""
    response = requests.post(
        endpoint,
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {api_key}"} if api_key else {}),
        },
        json={
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            "model": "gpt-3.5-turbo",
            "stream": False,
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    # Blackbox farklı format dönebilir, kontrol et
    if isinstance(data, list) and len(data) > 0:
        return data[0].get("message", {}).get("content", "Üzgünüm, bir hata oluştu.")
    return data.get("message", {}).get("content", data.get("response", "Üzgünüm, bir hata oluştu."))
