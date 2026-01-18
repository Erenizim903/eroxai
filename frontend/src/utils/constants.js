export const STORAGE_KEYS = {
  APP_STATE: 'eroxai-translation-state',
}

export const defaultSettings = {
  apiUrl: 'https://libretranslate.com/translate',
  apiKey: '',
  maxCharacters: 8000,
  workerUrl: '',
  useCloudOcr: false,
  useCloudTranslate: false,
  openAiModel: 'gpt-4o-mini',
}

export const languageOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Turkish' },
  { value: 'ja', label: 'Japanese' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'it', label: 'Italian' },
  { value: 'ru', label: 'Russian' },
]

export const ocrLanguageOptions = [
  { value: 'eng', label: 'English' },
  { value: 'tur', label: 'Turkish' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'deu', label: 'German' },
  { value: 'fra', label: 'French' },
  { value: 'spa', label: 'Spanish' },
  { value: 'ita', label: 'Italian' },
  { value: 'rus', label: 'Russian' },
]
