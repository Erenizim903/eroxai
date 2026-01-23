import { useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Container, Link, Stack, TextField, Typography, alpha } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useSiteStore } from '../store/useSiteStore'

const ForgotPassword = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail] = useState('')
  const siteSettings = useSiteStore((state) => state.settings)

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

  const handleSubmit = (event) => {
    event.preventDefault()
    enqueueSnackbar('Şifre sıfırlama talebin alındı. Destek ekibi seninle iletişime geçecek.', { variant: 'success' })
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
        <Card
          sx={{
            borderRadius: 4,
            background: alpha('#fff', 0.03),
            border: `1px solid ${alpha('#667eea', 0.2)}`,
            backdropFilter: 'blur(20px)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Stack spacing={1}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
                  Şifremi Unuttum
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                  Kayıtlı e-posta adresini gir. Sana geri dönüş sağlayalım.
                </Typography>
              </Stack>
              <TextField
                label="E-posta"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                sx={inputSx}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 700,
                }}
              >
                Talep Gönder
              </Button>
              {siteSettings?.contact_email && (
                <Button
                  variant="outlined"
                  onClick={() => window.open(`mailto:${siteSettings.contact_email}`)}
                  sx={{
                    borderColor: alpha('#667eea', 0.5),
                    color: 'white',
                    '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                  }}
                >
                  Destek: {siteSettings.contact_email}
                </Button>
              )}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: alpha('#fff', 0.8),
                  textDecoration: 'none',
                  '&:hover': { color: '#667eea' },
                }}
              >
                Giriş ekranına dön
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  )
}

export default ForgotPassword
