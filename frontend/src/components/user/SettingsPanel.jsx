import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const SettingsPanel = () => {
  const { enqueueSnackbar } = useSnackbar()
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)

  const [apiUrl, setApiUrl] = useState(settings.apiUrl)
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [maxCharacters, setMaxCharacters] = useState(settings.maxCharacters)
  const [workerUrl, setWorkerUrl] = useState(settings.workerUrl)
  const [useCloudOcr, setUseCloudOcr] = useState(settings.useCloudOcr)
  const [useCloudTranslate, setUseCloudTranslate] = useState(settings.useCloudTranslate)
  const [openAiModel, setOpenAiModel] = useState(settings.openAiModel)

  const handleSave = () => {
    updateSettings({
      apiUrl,
      apiKey,
      maxCharacters: Number(maxCharacters) || settings.maxCharacters,
      workerUrl,
      useCloudOcr,
      useCloudTranslate,
      openAiModel,
    })
    enqueueSnackbar('Ayarlar kaydedildi', { variant: 'success' })
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">API Ayarları</Typography>
          <TextField
            label="LibreTranslate API URL"
            value={apiUrl}
            onChange={(event) => setApiUrl(event.target.value)}
            helperText="Örn: https://libretranslate.com/translate"
          />
          <TextField
            label="API Anahtarı (Opsiyonel)"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
          <TextField
            label="Maksimum Karakter"
            type="number"
            value={maxCharacters}
            onChange={(event) => setMaxCharacters(event.target.value)}
          />
          <Divider />
          <Typography variant="h6">Cloudflare Worker</Typography>
          <TextField
            label="Worker Base URL"
            value={workerUrl}
            onChange={(event) => setWorkerUrl(event.target.value)}
            helperText="Örn: https://eroxai-workers.your-subdomain.workers.dev"
          />
          <FormControlLabel
            control={<Switch checked={useCloudOcr} onChange={(event) => setUseCloudOcr(event.target.checked)} />}
            label="Google Vision OCR kullan"
          />
          <FormControlLabel
            control={
              <Switch
                checked={useCloudTranslate}
                onChange={(event) => setUseCloudTranslate(event.target.checked)}
              />
            }
            label="OpenAI çeviri kullan"
          />
          <TextField
            label="OpenAI Model"
            value={openAiModel}
            onChange={(event) => setOpenAiModel(event.target.value)}
            helperText="Örn: gpt-4o-mini"
          />
          <Button variant="contained" onClick={handleSave}>
            Kaydet
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SettingsPanel
