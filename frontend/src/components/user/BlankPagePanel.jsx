import { useState } from 'react'
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import api from '../../services/api'

const BlankPagePanel = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [title, setTitle] = useState('Translated Document')
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [outputUrl, setOutputUrl] = useState('')

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
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Boş Sayfa (Japonca Çıktı)</Typography>
          <TextField
            label="Başlık"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            label="Metin"
            multiline
            minRows={6}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <Button variant="contained" onClick={handleGenerate} disabled={isLoading}>
            Japonca PDF Oluştur
          </Button>
          {outputUrl && (
            <Button variant="outlined" onClick={() => window.open(outputUrl, '_blank')}>
              PDF Aç
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default BlankPagePanel
