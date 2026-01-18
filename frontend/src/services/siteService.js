import api from './api'

export const fetchSiteSettings = async () => {
  const { data } = await api.get('/site-settings/')
  return data
}
