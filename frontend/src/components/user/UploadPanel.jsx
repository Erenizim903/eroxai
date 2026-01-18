import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { formatBytes, getFileMeta, isPdfFile } from '../../utils/fileUtils'
import { useAppStore } from '../../store/useAppStore'

const UploadPanel = () => {
  const file = useAppStore((state) => state.file)
  const setFile = useAppStore((state) => state.setFile)
  const [previewUrl, setPreviewUrl] = useState(null)

  const onDrop = useCallback(
    (acceptedFiles) => {
      const [first] = acceptedFiles
      if (first) {
        setFile(first)
      }
    },
    [setFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  const meta = useMemo(() => getFileMeta(file), [file])

  useEffect(() => {
    if (!file || isPdfFile(file)) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Dosya Yükle</Typography>
          <Box
            {...getRootProps()}
            sx={{
              border: '1px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'action.hover',
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1">
              {isDragActive ? 'Dosyayı bırakın' : 'Sürükleyip bırakın veya tıklayın'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PDF veya görsel dosyası (PNG/JPG)
            </Typography>
          </Box>
          {meta && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Seçilen Dosya</Typography>
              <Typography variant="body2">{meta.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {isPdfFile(file) ? 'PDF' : 'Görsel'} · {formatBytes(meta.size)}
              </Typography>
            </Stack>
          )}
          {previewUrl && (
            <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <img src={previewUrl} alt={meta?.name || 'preview'} />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default UploadPanel
