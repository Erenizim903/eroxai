import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import { useSnackbar } from 'notistack'
import { runCloudOcr, runOcr } from '../../services/ocrService'
import { useAppStore } from '../../store/useAppStore'
import { ocrLanguageOptions } from '../../utils/constants'
import { downloadText } from '../../utils/storage'

const OcrPanel = () => {
  const { enqueueSnackbar } = useSnackbar()
  const file = useAppStore((state) => state.file)
  const ocrText = useAppStore((state) => state.ocrText)
  const setOcrResult = useAppStore((state) => state.setOcrResult)
  const ocrLanguage = useAppStore((state) => state.ocrLanguage)
  const setOcrLanguage = useAppStore((state) => state.setOcrLanguage)
  const addHistory = useAppStore((state) => state.addHistory)
  const settings = useAppStore((state) => state.settings)

  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pageProgress, setPageProgress] = useState(null)

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

  const handleOcr = async () => {
    if (!file) {
      enqueueSnackbar('Lütfen önce bir dosya seçin', { variant: 'warning' })
      return
    }
    if (settings.useCloudOcr && !settings.workerUrl) {
      enqueueSnackbar('Cloud OCR için Worker URL girin', { variant: 'warning' })
      return
    }

    setIsRunning(true)
    setProgress(0)
    setPageProgress(null)

    try {
      const run = settings.useCloudOcr
        ? () =>
            runCloudOcr({
              file,
              language: ocrLanguage,
              workerUrl: settings.workerUrl,
              onProgress: (message) => {
                if (message.progress) {
                  setProgress(Math.round(message.progress * 100))
                }
              },
              onPageProgress: (current, total) => {
                setPageProgress(`${current}/${total}`)
              },
            })
        : () =>
            runOcr({
              file,
              language: ocrLanguage,
              onProgress: (message) => {
                if (message.progress) {
                  setProgress(Math.round(message.progress * 100))
                }
              },
              onPageProgress: (current, total) => {
                setPageProgress(`${current}/${total}`)
              },
            })

      const text = await run()
      setOcrResult(text)
      addHistory({
        type: 'OCR',
        createdAt: new Date().toISOString(),
        input: file.name,
        output: text.slice(0, 500),
      })
      enqueueSnackbar('OCR tamamlandı', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(`OCR başarısız: ${error.message}`, { variant: 'error' })
    } finally {
      setIsRunning(false)
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
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DescriptionIcon sx={{ fontSize: 38, color: '#667eea' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                OCR İşlemi
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                Belgeden metin çıkarın ve sonucu indirin.
              </Typography>
            </Box>
          </Stack>

          <Paper
            sx={{
              p: 3,
              background: alpha('#667eea', 0.1),
              border: `1px solid ${alpha('#667eea', 0.3)}`,
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <TextField
                  select
                  label="OCR Dil"
                  value={ocrLanguage}
                  onChange={(event) => setOcrLanguage(event.target.value)}
                  sx={{ minWidth: 180, ...inputSx }}
                >
                  {ocrLanguageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  onClick={handleOcr}
                  disabled={isRunning}
                  startIcon={<DescriptionIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                  }}
                >
                  {settings.useCloudOcr ? 'Cloud OCR Başlat' : 'OCR Başlat'}
                </Button>
                <Button
                  variant="outlined"
                  disabled={!ocrText}
                  onClick={() => downloadText('ocr-result.txt', ocrText)}
                  sx={{
                    borderColor: alpha('#667eea', 0.5),
                    color: 'white',
                    '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                  }}
                >
                  Metni İndir
                </Button>
              </Stack>
              {isRunning && (
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: alpha('#667eea', 0.1),
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #667eea 0%, #10B981 100%)',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                    {progress}% {pageProgress ? `· Sayfa ${pageProgress}` : ''}
                  </Typography>
                </Box>
              )}
              <TextField
                label="OCR Sonuç"
                multiline
                minRows={8}
                value={ocrText}
                onChange={(event) => setOcrResult(event.target.value)}
                placeholder="OCR çıktısı burada görünür..."
                sx={inputSx}
              />
            </Stack>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default OcrPanel
