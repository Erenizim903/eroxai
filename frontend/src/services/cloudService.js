const normalizeWorkerUrl = (url = '') => url.replace(/\/+$/, '')

const toLanguageHint = (ocrLanguage) => {
  const map = {
    eng: 'en',
    tur: 'tr',
    jpn: 'ja',
    deu: 'de',
    fra: 'fr',
    spa: 'es',
    ita: 'it',
    rus: 'ru',
  }
  return map[ocrLanguage]
}

export const cloudOcr = async ({ dataUrl, language, workerUrl, signal }) => {
  const baseUrl = normalizeWorkerUrl(workerUrl)
  if (!baseUrl) {
    throw new Error('Worker URL tanımlı değil')
  }

  const payload = {
    image: dataUrl,
  }
  const hint = toLanguageHint(language)
  if (hint) {
    payload.languageHint = hint
  }

  const response = await fetch(`${baseUrl}/v1/vision/ocr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Cloud OCR failed')
  }

  const data = await response.json()
  return data.text || ''
}

export const cloudTranslate = async ({ text, source, target, model, workerUrl, signal }) => {
  const baseUrl = normalizeWorkerUrl(workerUrl)
  if (!baseUrl) {
    throw new Error('Worker URL tanımlı değil')
  }

  const response = await fetch(`${baseUrl}/v1/openai/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      source,
      target,
      model,
    }),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Cloud translation failed')
  }

  const data = await response.json()
  return data.translation || ''
}
