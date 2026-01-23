import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  alpha,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import SettingsIcon from '@mui/icons-material/Settings'

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

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      background: alpha('#fff', 0.05),
      color: 'white',
      '& fieldset': { borderColor: alpha('#667eea', 0.3) },
      '&:hover fieldset': { borderColor: alpha('#667eea', 0.5) },
      '&.Mui-focused fieldset': { borderColor: '#667eea' },
    },
    '& .MuiInputLabel-root': { color: alpha('#fff', 0.7) },
  }

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
            <SettingsIcon sx={{ fontSize: 38, color: '#667eea' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                Ayarlar
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                API ve Cloud Worker yapılandırmalarını düzenleyin.
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
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                API Ayarları
              </Typography>
              <TextField
                label="LibreTranslate API URL"
                value={apiUrl}
                onChange={(event) => setApiUrl(event.target.value)}
                helperText="Örn: https://libretranslate.com/translate"
                sx={inputSx}
              />
              <TextField
                label="API Anahtarı (Opsiyonel)"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                sx={inputSx}
              />
              <TextField
                label="Maksimum Karakter"
                type="number"
                value={maxCharacters}
                onChange={(event) => setMaxCharacters(event.target.value)}
                sx={inputSx}
              />

              <Divider sx={{ borderColor: alpha('#667eea', 0.2) }} />

              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                Cloudflare Worker
              </Typography>
              <TextField
                label="Worker Base URL"
                value={workerUrl}
                onChange={(event) => setWorkerUrl(event.target.value)}
                helperText="Örn: https://eroxai-workers.your-subdomain.workers.dev"
                sx={inputSx}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={useCloudOcr}
                    onChange={(event) => setUseCloudOcr(event.target.checked)}
                  />
                }
                label="Google Vision OCR kullan"
                sx={{ color: alpha('#fff', 0.8) }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={useCloudTranslate}
                    onChange={(event) => setUseCloudTranslate(event.target.checked)}
                  />
                }
                label="OpenAI çeviri kullan"
                sx={{ color: alpha('#fff', 0.8) }}
              />
              <TextField
                label="OpenAI Model"
                value={openAiModel}
                onChange={(event) => setOpenAiModel(event.target.value)}
                helperText="Örn: gpt-4o-mini"
                sx={inputSx}
              />
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  alignSelf: 'flex-start',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 700,
                }}
              >
                Kaydet
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SettingsPanel
