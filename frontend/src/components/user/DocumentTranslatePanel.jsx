import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useSnackbar } from 'notistack'
import { uploadDocument, runOcr, translateDocument } from '../../services/documentService'
import { ocrLanguageOptions } from '../../utils/constants'
import { downloadText } from '../../utils/storage'

const DocumentTranslatePanel = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [file, setFile] = useState(null)
  const [documentId, setDocumentId] = useState(null)
  const [ocrText, setOcrText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [languageHint, setLanguageHint] = useState('eng')
  const [isLoading, setIsLoading] = useState(false)

  const inputSx = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        background: alpha('#fff', 0.05),
        color: 'white',
        '& fieldset': { borderColor: alpha('#667eea', 0.3) },
        '&:hover fieldset': { borderColor: alpha('#667eea', 0.5) },
        '&.Mui-focused fieldset': { borderColor: '#667eea' },
      },
      '& .MuiInputLabel-root': { color: alpha('#fff', 0.7) },
    }),
    [],
  )

  const handleUpload = async () => {
    if (!file) return
    setIsLoading(true)
    try {
      const doc = await uploadDocument(file)
      setDocumentId(doc.id)
      enqueueSnackbar('Dosya yüklendi', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Dosya yükleme başarısız', { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOcr = async () => {
    if (!documentId) return
    setIsLoading(true)
    try {
      const doc = await runOcr(documentId, languageHint)
      setOcrText(doc.extracted_text || '')
      enqueueSnackbar('OCR tamamlandı', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('OCR başarısız', { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTranslate = async () => {
    if (!documentId) return
    setIsLoading(true)
    try {
      const doc = await translateDocument(documentId)
      setTranslatedText(doc.translated_text || '')
      enqueueSnackbar('Çeviri tamamlandı', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Çeviri başarısız', { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

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
        <Stack spacing={4}>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesomeIcon sx={{ fontSize: 40, color: '#667eea' }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                  Belge OCR + Japonca Çeviri
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                  Dosyanı yükle, OCR çalıştır ve çevirini tek panelden yönet.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Paper
            sx={{
              p: 3,
              background: alpha('#667eea', 0.1),
              border: `1px solid ${alpha('#667eea', 0.3)}`,
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                1. Dosya Yükle
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderColor: alpha('#667eea', 0.5),
                    color: 'white',
                    '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                  }}
                >
                  Dosya Seç
                  <input hidden type="file" onChange={(event) => setFile(event.target.files?.[0])} />
                </Button>
                {file ? (
                  <Chip
                    label={file.name}
                    sx={{
                      maxWidth: { xs: '100%', sm: 320 },
                      background: alpha('#fff', 0.1),
                      color: 'white',
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                    PDF veya görsel dosyası seçin
                  </Typography>
                )}
              </Stack>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!file || isLoading}
                sx={{
                  alignSelf: 'flex-start',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 700,
                }}
              >
                Dosyayı Yükle
              </Button>
            </Stack>
          </Paper>

          <Divider sx={{ borderColor: alpha('#667eea', 0.2) }} />

          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
              2. OCR Ayarları ve Çalıştır
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                select
                label="OCR Dil"
                value={languageHint}
                onChange={(event) => setLanguageHint(event.target.value)}
                sx={{ maxWidth: 240, ...inputSx }}
              >
                {ocrLanguageOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                onClick={handleOcr}
                disabled={!documentId || isLoading}
                sx={{
                  borderColor: alpha('#667eea', 0.5),
                  color: 'white',
                  '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                }}
              >
                OCR Başlat
              </Button>
              <Button
                variant="outlined"
                onClick={handleTranslate}
                disabled={!documentId || isLoading}
                sx={{
                  borderColor: alpha('#667eea', 0.5),
                  color: 'white',
                  '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                }}
              >
                Japonca Çeviri
              </Button>
            </Stack>
            {isLoading && (
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: alpha('#667eea', 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #667eea 0%, #10B981 100%)',
                  },
                }}
              />
            )}
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
              3. Sonuçlar
            </Typography>
            <TextField
              label="OCR Sonuç"
              multiline
              minRows={4}
              value={ocrText}
              onChange={(event) => setOcrText(event.target.value)}
              sx={inputSx}
            />
            <TextField
              label="Japonca Çeviri"
              multiline
              minRows={4}
              value={translatedText}
              onChange={(event) => setTranslatedText(event.target.value)}
              sx={inputSx}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                onClick={() => downloadText('ocr.txt', ocrText)}
                disabled={!ocrText}
                sx={{
                  borderColor: alpha('#667eea', 0.5),
                  color: 'white',
                  '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                }}
              >
                OCR İndir
              </Button>
              <Button
                variant="outlined"
                onClick={() => downloadText('translation-ja.txt', translatedText)}
                disabled={!translatedText}
                sx={{
                  borderColor: alpha('#667eea', 0.5),
                  color: 'white',
                  '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                }}
              >
                Japonca İndir
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default DocumentTranslatePanel
