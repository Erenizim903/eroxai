import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import TranslateIcon from '@mui/icons-material/Translate'
import { useSnackbar } from 'notistack'
import { useAppStore } from '../../store/useAppStore'
import { languageOptions } from '../../utils/constants'
import { translateText } from '../../services/translationService'
import { downloadText } from '../../utils/storage'
import { cloudTranslate } from '../../services/cloudService'

const TranslatePanel = () => {
  const { enqueueSnackbar } = useSnackbar()
  const ocrText = useAppStore((state) => state.ocrText)
  const translationText = useAppStore((state) => state.translationText)
  const setTranslation = useAppStore((state) => state.setTranslation)
  const sourceLanguage = useAppStore((state) => state.sourceLanguage)
  const targetLanguage = useAppStore((state) => state.targetLanguage)
  const setSourceLanguage = useAppStore((state) => state.setSourceLanguage)
  const setTargetLanguage = useAppStore((state) => state.setTargetLanguage)
  const settings = useAppStore((state) => state.settings)
  const addHistory = useAppStore((state) => state.addHistory)
  const [inputText, setInputText] = useState(ocrText || '')
  const [isTranslating, setIsTranslating] = useState(false)
  const abortRef = useRef(null)

  const sourceOptions = useMemo(() => languageOptions, [])
  const targetOptions = useMemo(() => languageOptions.filter((opt) => opt.value !== 'auto'), [])

  const handleSwap = () => {
    if (sourceLanguage === 'auto') return
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
  }

  useEffect(() => {
    if (!inputText.trim() && ocrText) {
      setInputText(ocrText)
    }
  }, [ocrText, inputText])

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      enqueueSnackbar('Lütfen çevrilecek metni girin', { variant: 'warning' })
      return
    }

    if (inputText.length > settings.maxCharacters) {
      enqueueSnackbar(`Maksimum ${settings.maxCharacters} karakter`, { variant: 'warning' })
      return
    }

    if (settings.useCloudTranslate && !settings.workerUrl) {
      enqueueSnackbar('Cloud çeviri için Worker URL girin', { variant: 'warning' })
      return
    }

    setIsTranslating(true)
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const translated = settings.useCloudTranslate
        ? await cloudTranslate({
            text: inputText,
            source: sourceLanguage,
            target: targetLanguage,
            model: settings.openAiModel,
            workerUrl: settings.workerUrl,
            signal: controller.signal,
          })
        : await translateText({
            text: inputText,
            source: sourceLanguage,
            target: targetLanguage,
            settings,
            signal: controller.signal,
          })
      setTranslation(translated)
      addHistory({
        type: 'Translate',
        createdAt: new Date().toISOString(),
        input: inputText.slice(0, 500),
        output: translated.slice(0, 500),
      })
      enqueueSnackbar('Çeviri tamamlandı', { variant: 'success' })
    } catch (error) {
      if (error.name === 'AbortError') return
      enqueueSnackbar(`Çeviri başarısız: ${error.message}`, { variant: 'error' })
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              select
              label="Kaynak"
              value={sourceLanguage}
              onChange={(event) => setSourceLanguage(event.target.value)}
              sx={{ minWidth: 160 }}
            >
              {sourceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" onClick={handleSwap} startIcon={<SwapHorizIcon />}>
              Değiştir
            </Button>
            <TextField
              select
              label="Hedef"
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
              sx={{ minWidth: 160 }}
            >
              {targetOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            label="Çevirilecek Metin"
            multiline
            minRows={6}
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder="OCR çıktısını buraya yapıştırabilir veya yeni metin yazabilirsiniz."
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Button
              variant="contained"
              onClick={handleTranslate}
              startIcon={<TranslateIcon />}
              disabled={isTranslating}
            >
              {isTranslating
                ? 'Çeviriliyor...'
                : settings.useCloudTranslate
                  ? 'Cloud Çeviri Başlat'
                  : 'Çeviri Başlat'}
            </Button>
            <Button variant="outlined" onClick={() => setInputText(ocrText || '')}>
              OCR Metnini Kullan
            </Button>
            <Button
              variant="outlined"
              disabled={!translationText}
              onClick={() => downloadText('translation.txt', translationText)}
            >
              Çeviriyi İndir
            </Button>
          </Stack>
          <Typography variant="subtitle2">Çeviri Sonucu</Typography>
          <TextField
            multiline
            minRows={6}
            value={translationText}
            onChange={(event) => setTranslation(event.target.value)}
            placeholder="Çeviri sonucu burada görünür..."
          />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default TranslatePanel
