import { create } from 'zustand'
import { fetchMe, loginUser } from '../services/authService'

const ACCESS_TOKEN_KEY = 'eroxai-access-token'

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)),
  login: async (payload) => {
    set({ isLoading: true })
    const response = await loginUser(payload)
    localStorage.setItem(ACCESS_TOKEN_KEY, response.tokens.access)
    set({ isAuthenticated: true, user: response.user, isLoading: false })
  },
  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    set({ isAuthenticated: false, user: null })
  },
  loadMe: async () => {
    set({ isLoading: true })
    const user = await fetchMe()
    set({ user, isAuthenticated: true, isLoading: false })
  },
}))
