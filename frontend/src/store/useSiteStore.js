import { create } from 'zustand'
import { fetchSiteSettings } from '../services/siteService'

export const useSiteStore = create((set) => ({
  settings: null,
  loadSettings: async () => {
    try {
      const data = await fetchSiteSettings()
      set({ settings: data || null })
    } catch (error) {
      set({ settings: null })
    }
  },
}))
