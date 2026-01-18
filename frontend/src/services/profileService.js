import api from './api'

export const updateProfile = async (payload) => {
  const { data } = await api.put('/auth/profile/', payload)
  return data
}
