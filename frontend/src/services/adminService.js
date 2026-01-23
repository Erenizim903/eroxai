import api from './api'

export const fetchAdminUsers = async () => {
  const { data } = await api.get('/admin/users/')
  return data
}

export const createAdminUser = async (payload) => {
  const { data } = await api.post('/admin/users/create/', payload)
  return data
}

export const deleteAdminUser = async (userId) => {
  const { data } = await api.delete(`/admin/users/${userId}/delete/`)
  return data
}

export const fetchAdminLogs = async () => {
  const { data } = await api.get('/admin/logs/')
  return data
}

export const fetchPremiumKeys = async () => {
  const { data } = await api.get('/admin/premium-keys/')
  return data
}

export const createPremiumKey = async (payload) => {
  const { data } = await api.post('/admin/premium-keys/', payload)
  return data
}

export const addTemplateField = async (templateId, payload) => {
  const { data } = await api.post(`/admin/templates/${templateId}/fields/`, payload)
  return data
}

export const deleteTemplateField = async (templateId, fieldId) => {
  const { data } = await api.delete(`/admin/templates/${templateId}/fields/${fieldId}/delete/`)
  return data
}

export const updateTemplateField = async (templateId, fieldId, payload) => {
  const { data } = await api.put(`/admin/templates/${templateId}/fields/${fieldId}/update/`, payload)
  return data
}

export const updateSiteSettings = async (payload) => {
  const { data } = await api.put('/site-settings/update/', payload)
  return data
}

export const deleteTemplate = async (templateId) => {
  const { data } = await api.delete(`/admin/templates/${templateId}/delete/`)
  return data
}

export const fetchAdminAnalytics = async () => {
  const { data } = await api.get('/admin/analytics/')
  return data
}

export const fetchAdminActivityLogs = async (params = {}) => {
  const { data } = await api.get('/admin/activity-logs/', { params })
  return data
}
