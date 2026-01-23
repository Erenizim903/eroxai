import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Card, CardContent, Chip, Stack, Typography, alpha } from '@mui/material'
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
    <Card
      sx={{
        borderRadius: 4,
        background: alpha('#fff', 0.03),
        border: `1px solid ${alpha('#667eea', 0.2)}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <CloudUploadIcon sx={{ fontSize: 38, color: '#667eea' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                Dosya Yükle
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                PDF veya görsel dosyasını sürükleyip bırak ya da tıkla.
              </Typography>
            </Box>
          </Stack>

          <Box
            {...getRootProps()}
            sx={{
              border: '1px dashed',
              borderColor: isDragActive ? '#667eea' : alpha('#667eea', 0.4),
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              background: alpha('#667eea', 0.08),
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#667eea',
                background: alpha('#667eea', 0.15),
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 52, color: '#667eea', mb: 1 }} />
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
              {isDragActive ? 'Dosyayı bırakın' : 'Sürükleyip bırakın veya tıklayın'}
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
              PDF veya görsel dosyası (PNG/JPG)
            </Typography>
          </Box>

          {meta && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: alpha('#fff', 0.7) }}>
                Seçilen Dosya
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip
                  label={meta.name}
                  sx={{
                    background: alpha('#fff', 0.1),
                    color: 'white',
                    maxWidth: { xs: '100%', sm: 360 },
                  }}
                />
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                  {isPdfFile(file) ? 'PDF' : 'Görsel'} · {formatBytes(meta.size)}
                </Typography>
              </Stack>
            </Stack>
          )}

          {previewUrl && (
            <Box sx={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${alpha('#667eea', 0.2)}` }}>
              <img src={previewUrl} alt={meta?.name || 'preview'} style={{ width: '100%', display: 'block' }} />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default UploadPanel
