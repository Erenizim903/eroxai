import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography, alpha } from '@mui/material'
import { useEffect, useState } from 'react'
import TypewriterText from '../../components/common/TypewriterText'
import { fetchOcrStatus } from '../../services/adminService'

const StatusChip = ({ label, ok }) => (
  <Chip
    label={label}
    sx={{
      background: ok ? alpha('#10B981', 0.2) : alpha('#F04438', 0.2),
      color: ok ? '#10B981' : '#F04438',
      fontWeight: 700,
    }}
  />
)

const AdminOcrStatus = () => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadStatus = async () => {
    setLoading(true)
    try {
      const data = await fetchOcrStatus()
      setStatus(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus().catch(() => {})
  }, [])

  return (
    <Box>
      <TypewriterText
        text="OCR Durumu"
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
                Servis Durumu
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <StatusChip label="Tesseract" ok={Boolean(status?.tesseract_available)} />
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    {status?.tesseract_available ? 'Kurulu' : 'Kurulu değil'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <StatusChip label="Google Vision API" ok={Boolean(status?.google_vision_configured)} />
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                    {status?.google_vision_configured ? 'Anahtar mevcut' : 'Anahtar yok'}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Bilgilendirme
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                Google Vision başarısız olursa Tesseract devreye girer. Tesseract kurulu değilse local OCR
                çalışmaz. Kurulum sonrası burada “Kurulu” olarak görünmelidir.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={loadStatus} disabled={loading}>
          Durumu Yenile
        </Button>
      </Box>
    </Box>
  )
}

export default AdminOcrStatus
