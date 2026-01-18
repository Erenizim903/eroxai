export const translateText = async ({
  text,
  source,
  target,
  settings,
  signal,
}) => {
  if (!text) return ''
  const payload = {
    q: text,
    source,
    target,
    format: 'text',
  }

  if (settings?.apiKey) {
    payload.api_key = settings.apiKey
  }

  const response = await fetch(settings.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Translation failed')
  }

  const data = await response.json()
  return data.translatedText || ''
}
