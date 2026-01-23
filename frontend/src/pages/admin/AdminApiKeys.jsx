import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, alpha } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import TypewriterText from '../../components/common/TypewriterText'
import { fetchApiKeys, updateApiKeys } from '../../services/adminService'

const AdminApiKeys = () => {
  const [form, setForm] = useState({
    openai_api_key: '',
    google_vision_api_key: '',
    deepseek_api_key: '',
    blackbox_api_key: '',
    blackbox_repo_url: '',
  })
  const [status, setStatus] = useState({
    openai_api_key_set: false,
    google_vision_api_key_set: false,
    deepseek_api_key_set: false,
    blackbox_api_key_set: false,
    blackbox_repo_url: '',
  })
  const [saving, setSaving] = useState(false)
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

  const loadKeys = async () => {
    const data = await fetchApiKeys()
    setStatus((prev) => ({ ...prev, ...data }))
    setForm({
      openai_api_key: '',
      google_vision_api_key: '',
      deepseek_api_key: '',
      blackbox_api_key: '',
      blackbox_repo_url: data.blackbox_repo_url || '',
    })
  }

  useEffect(() => {
    loadKeys().catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([key, value]) => {
          if (key === 'blackbox_repo_url') return typeof value === 'string'
          return typeof value === 'string' && value.trim()
        }),
      )
      await updateApiKeys(payload)
      await loadKeys()
    } finally {
      setSaving(false)
    }
  }

  const handleClear = async (field) => {
    await updateApiKeys({ [field]: '' })
    await loadKeys()
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  return (
    <Box>
      <TypewriterText
        text="API Anahtarları"
        variant="h4"
        speed={40}
        sx={{
          fontWeight: 800,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Model ve OCR Anahtarları
              </Typography>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <TextField
                    label="OpenAI API Key"
                    value={form.openai_api_key || ''}
                    onChange={handleChange('openai_api_key')}
                    helperText={status.openai_api_key_set ? 'Mevcut anahtar var' : 'Anahtar yok'}
                    sx={inputSx}
                  />
                  {status.openai_api_key_set && (
                    <Button size="small" variant="outlined" onClick={() => handleClear('openai_api_key')}>
                      OpenAI Anahtarını Sil
                    </Button>
                  )}
                </Stack>
                <Stack spacing={1}>
                  <TextField
                    label="Google Vision API Key"
                    value={form.google_vision_api_key || ''}
                    onChange={handleChange('google_vision_api_key')}
                    helperText={status.google_vision_api_key_set ? 'Mevcut anahtar var' : 'Anahtar yok'}
                    sx={inputSx}
                  />
                  {status.google_vision_api_key_set && (
                    <Button size="small" variant="outlined" onClick={() => handleClear('google_vision_api_key')}>
                      Google Vision Anahtarını Sil
                    </Button>
                  )}
                </Stack>
                <Stack spacing={1}>
                  <TextField
                    label="DeepSeek API Key"
                    value={form.deepseek_api_key || ''}
                    onChange={handleChange('deepseek_api_key')}
                    helperText={status.deepseek_api_key_set ? 'Mevcut anahtar var' : 'Anahtar yok'}
                    sx={inputSx}
                  />
                  {status.deepseek_api_key_set && (
                    <Button size="small" variant="outlined" onClick={() => handleClear('deepseek_api_key')}>
                      DeepSeek Anahtarını Sil
                    </Button>
                  )}
                </Stack>
                <Stack spacing={1}>
                  <TextField
                    label="Blackbox API Key"
                    value={form.blackbox_api_key || ''}
                    onChange={handleChange('blackbox_api_key')}
                    helperText={status.blackbox_api_key_set ? 'Mevcut anahtar var' : 'Anahtar yok'}
                    sx={inputSx}
                  />
                  {status.blackbox_api_key_set && (
                    <Button size="small" variant="outlined" onClick={() => handleClear('blackbox_api_key')}>
                      Blackbox Anahtarını Sil
                    </Button>
                  )}
                </Stack>
                <TextField
                  label="Blackbox Repo URL"
                  value={form.blackbox_repo_url || ''}
                  onChange={handleChange('blackbox_repo_url')}
                  helperText="Task endpoint için repo URL"
                  sx={inputSx}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Güvenlik Notu
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                Bu alana yazdığınız anahtarlar veritabanında saklanır. Boş bırakıp kaydetmek anahtarı kaldırır.
                Güvenlik için yalnızca gerekli anahtarları ekleyin.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Kaydet
        </Button>
      </Box>
    </Box>
  )
}

export default AdminApiKeys
