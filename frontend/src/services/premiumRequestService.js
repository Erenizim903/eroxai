import api from './api'

export const createPremiumRequest = async (reason) => {
  const { data } = await api.post('/premium-requests/create/', { reason })
  return data
}

export const getMyPremiumRequests = async () => {
  const { data } = await api.get('/premium-requests/my/')
  return data
}

export const getAdminPremiumRequests = async (status = null) => {
  const params = status ? { status } : {}
  const { data } = await api.get('/admin/premium-requests/', { params })
  return data
}

export const approvePremiumRequest = async (requestId, keyCode, maxUses, adminNote) => {
  const { data } = await api.post(`/admin/premium-requests/${requestId}/approve/`, {
    key_code: keyCode,
    max_uses: maxUses,
    admin_note: adminNote,
  })
  return data
}

export const rejectPremiumRequest = async (requestId, adminNote) => {
  const { data } = await api.post(`/admin/premium-requests/${requestId}/reject/`, {
    admin_note: adminNote,
  })
  return data
}
