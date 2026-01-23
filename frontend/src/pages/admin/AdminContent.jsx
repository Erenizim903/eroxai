import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, alpha } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { updateSiteSettings } from '../../services/adminService'
import { useSiteStore } from '../../store/useSiteStore'
import TypewriterText from '../../components/common/TypewriterText'

const AdminContent = () => {
  const siteSettings = useSiteStore((state) => state.settings)
  const loadSettings = useSiteStore((state) => state.loadSettings)
  const [form, setForm] = useState({
    site_name: '',
    hero_title: '',
    hero_subtitle: '',
    contact_email: '',
    contact_phone: '',
    contact_whatsapp: '',
    address: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_linkedin: '',
    social_youtube: '',
    social_github: '',
    social_telegram: '',
    theme_primary_color: '#667eea',
    theme_secondary_color: '#764ba2',
    theme_preset: 'ocean',
  })
  const [siteTextsJson, setSiteTextsJson] = useState('{}')
  const [logoFile, setLogoFile] = useState(null)
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

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  useEffect(() => {
    if (!siteSettings) return
    setForm((prev) => ({
      ...prev,
      ...siteSettings,
    }))
    setSiteTextsJson(JSON.stringify(siteSettings.site_texts || {}, null, 2))
  }, [siteSettings])

  const handleSave = async () => {
    let site_texts = {}
    try {
      site_texts = siteTextsJson ? JSON.parse(siteTextsJson) : {}
    } catch (error) {
      alert('JSON formatı hatalı. Lütfen kontrol edin.')
      return
    }
    setSaving(true)
    try {
      if (logoFile) {
        const payload = new FormData()
        Object.entries({ ...form, site_texts }).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            payload.append(key, value)
          }
        })
        payload.append('logo', logoFile)
        await updateSiteSettings(payload)
      } else {
        await updateSiteSettings({ ...form, site_texts })
      }
      await loadSettings()
      setLogoFile(null)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  return (
    <Box>
      <TypewriterText
        text="Site İçerikleri"
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
                Genel Ayarlar
              </Typography>
              <Stack spacing={2}>
                <TextField label="Site Adı" value={form.site_name || ''} onChange={handleChange('site_name')} sx={inputSx} />
                <Button variant="outlined" component="label">
                  Logo Yükle
                  <input type="file" hidden onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                </Button>
                {logoFile && (
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                    Seçilen logo: {logoFile.name}
                  </Typography>
                )}
                <TextField label="Hero Başlık" value={form.hero_title || ''} onChange={handleChange('hero_title')} sx={inputSx} />
                <TextField
                  label="Hero Alt Başlık"
                  value={form.hero_subtitle || ''}
                  onChange={handleChange('hero_subtitle')}
                  multiline
                  minRows={3}
                  sx={inputSx}
                />
                <TextField label="İletişim E-posta" value={form.contact_email || ''} onChange={handleChange('contact_email')} sx={inputSx} />
                <TextField label="Telefon" value={form.contact_phone || ''} onChange={handleChange('contact_phone')} sx={inputSx} />
                <TextField label="WhatsApp" value={form.contact_whatsapp || ''} onChange={handleChange('contact_whatsapp')} sx={inputSx} />
                <TextField label="Adres" value={form.address || ''} onChange={handleChange('address')} multiline minRows={2} sx={inputSx} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Sosyal Medya
              </Typography>
              <Stack spacing={2}>
                <TextField label="Facebook" value={form.social_facebook || ''} onChange={handleChange('social_facebook')} sx={inputSx} />
                <TextField label="Instagram" value={form.social_instagram || ''} onChange={handleChange('social_instagram')} sx={inputSx} />
                <TextField label="Twitter/X" value={form.social_twitter || ''} onChange={handleChange('social_twitter')} sx={inputSx} />
                <TextField label="LinkedIn" value={form.social_linkedin || ''} onChange={handleChange('social_linkedin')} sx={inputSx} />
                <TextField label="YouTube" value={form.social_youtube || ''} onChange={handleChange('social_youtube')} sx={inputSx} />
                <TextField label="GitHub" value={form.social_github || ''} onChange={handleChange('social_github')} sx={inputSx} />
                <TextField label="Telegram" value={form.social_telegram || ''} onChange={handleChange('social_telegram')} sx={inputSx} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Tema Ayarları
              </Typography>
              <Stack spacing={2}>
                <TextField label="Primary Color" value={form.theme_primary_color || ''} onChange={handleChange('theme_primary_color')} sx={inputSx} />
                <TextField label="Secondary Color" value={form.theme_secondary_color || ''} onChange={handleChange('theme_secondary_color')} sx={inputSx} />
                <TextField label="Preset" value={form.theme_preset || ''} onChange={handleChange('theme_preset')} sx={inputSx} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Gelişmiş Metinler (JSON)
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), mb: 2 }}>
                Buraya Templates / Workflow gibi sayfa metinlerini JSON formatında yazabilirsiniz.
              </Typography>
              <TextField
                label="site_texts"
                value={siteTextsJson}
                onChange={(e) => setSiteTextsJson(e.target.value)}
                multiline
                minRows={12}
                sx={inputSx}
              />
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

export default AdminContent
