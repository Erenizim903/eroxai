export const loadJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    if (!value) return fallback
    return JSON.parse(value)
  } catch (error) {
    return fallback
  }
}

export const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    // Ignore storage errors for private mode.
  }
}

export const downloadText = (filename, text) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
