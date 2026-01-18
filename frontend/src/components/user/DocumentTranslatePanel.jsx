import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
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
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Belge OCR + Çeviri</Typography>
          <input type="file" onChange={(event) => setFile(event.target.files?.[0])} />
          <Button variant="contained" onClick={handleUpload} disabled={!file || isLoading}>
            Dosyayı Yükle
          </Button>
          <TextField
            select
            label="OCR Dil"
            value={languageHint}
            onChange={(event) => setLanguageHint(event.target.value)}
            sx={{ maxWidth: 240 }}
          >
            {ocrLanguageOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Button variant="outlined" onClick={handleOcr} disabled={!documentId || isLoading}>
              OCR Başlat
            </Button>
            <Button variant="outlined" onClick={handleTranslate} disabled={!documentId || isLoading}>
              Japonca Çeviri
            </Button>
          </Stack>
          {isLoading && <LinearProgress />}
          <TextField
            label="OCR Sonuç"
            multiline
            minRows={4}
            value={ocrText}
            onChange={(event) => setOcrText(event.target.value)}
          />
          <TextField
            label="Japonca Çeviri"
            multiline
            minRows={4}
            value={translatedText}
            onChange={(event) => setTranslatedText(event.target.value)}
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Button
              variant="outlined"
              onClick={() => downloadText('ocr.txt', ocrText)}
              disabled={!ocrText}
            >
              OCR İndir
            </Button>
            <Button
              variant="outlined"
              onClick={() => downloadText('translation-ja.txt', translatedText)}
              disabled={!translatedText}
            >
              Japonca İndir
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default DocumentTranslatePanel
