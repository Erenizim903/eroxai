import api from './api'

export const listTemplates = async () => {
  const { data } = await api.get('/templates/')
  return data
}

export const fillTemplate = async (templateId, inputData) => {
  const { data } = await api.post(`/templates/${templateId}/fill/`, { input_data: inputData })
  return data
}

export const createTemplate = async (payload) => {
  const { data } = await api.post('/templates/create/', payload)
  return data
}
