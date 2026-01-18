export const isPdfFile = (file) => file?.type === 'application/pdf'

export const formatBytes = (bytes = 0) => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })

export const getFileMeta = (file) => {
  if (!file) return null
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
  }
}
