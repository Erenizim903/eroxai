import api from './api'

export const sendChatMessage = async (message, language = 'tr') => {
  const { data } = await api.post('/ai/chat/', { message, language })
  return data
}
