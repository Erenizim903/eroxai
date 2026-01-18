import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
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
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              select
              label="OCR Dil"
              value={ocrLanguage}
              onChange={(event) => setOcrLanguage(event.target.value)}
              sx={{ minWidth: 180 }}
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
            >
              {settings.useCloudOcr ? 'Cloud OCR Başlat' : 'OCR Başlat'}
            </Button>
            <Button
              variant="outlined"
              disabled={!ocrText}
              onClick={() => downloadText('ocr-result.txt', ocrText)}
            >
              Metni İndir
            </Button>
          </Stack>
          {isRunning && (
            <Box>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" color="text.secondary">
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
          />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default OcrPanel
