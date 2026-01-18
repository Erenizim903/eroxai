import api from './api'

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register/', payload)
  return data
}

export const verifyEmail = async (token) => {
  const { data } = await api.post('/auth/verify/', { token })
  return data
}

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login/', payload)
  return data
}

export const fetchMe = async () => {
  const { data } = await api.get('/auth/me/')
  return data
}

export const redeemPremiumKey = async (code) => {
  const { data } = await api.post('/auth/redeem-key/', { code })
  return data
}

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout/')
  } catch (error) {
    // Silent fail - logout should work even if backend call fails
  }
}
