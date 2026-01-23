import { useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Divider, Paper, Stack, TextField, Typography, alpha } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { useSnackbar } from 'notistack'
import api from '../../services/api'

const BlankPagePanel = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [title, setTitle] = useState('Translated Document')
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [outputUrl, setOutputUrl] = useState('')

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

  const handleGenerate = async () => {
    if (!text.trim()) return
    setIsLoading(true)
    try {
      const { data: payload } = await api.post('/documents/blank/', {
        text,
        title,
        source_language: 'auto',
      })
      if (payload.output_file) {
        const url = payload.output_file.startsWith('http')
          ? payload.output_file
          : `${window.location.origin}${payload.output_file}`
        setOutputUrl(url)
      }
      enqueueSnackbar('Çıktı hazır', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Boş sayfa üretimi başarısız', { variant: 'error' })
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
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <NoteAddIcon sx={{ fontSize: 38, color: '#667eea' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                Boş Sayfa (Japonca Çıktı)
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                Başlık ve metni gir, tek tıkla Japonca PDF oluştur.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: alpha('#667eea', 0.2) }} />

          <Paper
            sx={{
              p: 3,
              background: alpha('#667eea', 0.1),
              border: `1px solid ${alpha('#667eea', 0.3)}`,
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <TextField label="Başlık" value={title} onChange={(event) => setTitle(event.target.value)} sx={inputSx} />
              <TextField
                label="Metin"
                multiline
                minRows={6}
                value={text}
                onChange={(event) => setText(event.target.value)}
                sx={inputSx}
              />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                  }}
                >
                  Japonca PDF Oluştur
                </Button>
                {outputUrl && (
                  <Button
                    variant="outlined"
                    onClick={() => window.open(outputUrl, '_blank')}
                    sx={{
                      borderColor: alpha('#667eea', 0.5),
                      color: 'white',
                      '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                    }}
                  >
                    PDF Aç
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default BlankPagePanel
