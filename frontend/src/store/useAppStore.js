import { create } from 'zustand'
import { loadJSON, saveJSON } from '../utils/storage'
import { defaultSettings, STORAGE_KEYS } from '../utils/constants'

const initialState = loadJSON(STORAGE_KEYS.APP_STATE, {
  mode: 'dark',
  file: null,
  ocrText: '',
  translationText: '',
  ocrLanguage: 'eng',
  sourceLanguage: 'auto',
  targetLanguage: 'tr',
  history: [],
  settings: defaultSettings,
})

export const useAppStore = create((set, get) => ({
  ...initialState,
  persist: (next) => {
    saveJSON(STORAGE_KEYS.APP_STATE, { ...get(), ...next, file: null })
  },
  setMode: (mode) => {
    set({ mode })
    get().persist({ mode })
  },
  setFile: (file) => {
    set({ file })
    get().persist({ file })
  },
  setOcrResult: (text) => {
    set({ ocrText: text })
    get().persist({ ocrText: text })
  },
  setTranslation: (text) => {
    set({ translationText: text })
    get().persist({ translationText: text })
  },
  setOcrLanguage: (language) => {
    set({ ocrLanguage: language })
    get().persist({ ocrLanguage: language })
  },
  setSourceLanguage: (language) => {
    set({ sourceLanguage: language })
    get().persist({ sourceLanguage: language })
  },
  setTargetLanguage: (language) => {
    set({ targetLanguage: language })
    get().persist({ targetLanguage: language })
  },
  updateSettings: (settings) => {
    set({ settings })
    get().persist({ settings })
  },
  addHistory: (entry) => {
    const history = [entry, ...get().history].slice(0, 50)
    set({ history })
    get().persist({ history })
  },
  clearHistory: () => {
    set({ history: [] })
    get().persist({ history: [] })
  },
}))
