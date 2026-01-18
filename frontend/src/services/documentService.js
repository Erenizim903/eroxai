import api from './api'

export const uploadDocument = async (file, sourceLanguage = 'auto') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('source_language', sourceLanguage)
  const { data } = await api.post('/documents/upload/', formData)
  return data
}

export const runOcr = async (docId, languageHint) => {
  const { data } = await api.post(`/documents/${docId}/ocr/`, { language_hint: languageHint })
  return data
}

export const translateDocument = async (docId) => {
  const { data } = await api.post(`/documents/${docId}/translate/`)
  return data
}

export const fullTranslate = async (text, sourceLanguage = 'auto') => {
  const { data } = await api.post('/documents/full-translate/', {
    text,
    source_language: sourceLanguage,
  })
  return data
}
