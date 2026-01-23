import { create } from 'zustand'
import { fetchMe, loginUser, logoutUser } from '../services/authService'

const ACCESS_TOKEN_KEY = 'eroxai-access-token'

const isValidToken = (value) => {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (trimmed === 'undefined' || trimmed === 'null') return false
  return true
}

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: isValidToken(localStorage.getItem(ACCESS_TOKEN_KEY)),
  login: async (payload) => {
    set({ isLoading: true })
    try {
      const response = await loginUser(payload)
      localStorage.setItem(ACCESS_TOKEN_KEY, response.tokens.access)
      set({ isAuthenticated: true, user: response.user, isLoading: false })
      return response
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  logout: async () => {
    try {
      await logoutUser()
    } catch (error) {
      // Silent fail
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    set({ isAuthenticated: false, user: null, isLoading: false })
  },
  loadMe: async () => {
    set({ isLoading: true })
    try {
      const user = await fetchMe()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
