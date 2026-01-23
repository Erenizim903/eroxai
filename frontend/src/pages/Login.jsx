import { useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Container, Divider, Link, Stack, TextField, Typography, alpha } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useAuthStore } from '../store/useAuthStore'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const Login = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login({ username, password })
      enqueueSnackbar('Giriş başarılı', { variant: 'success' })
      navigate('/dashboard')
    } catch (error) {
      const code = error?.response?.data?.code
      if (error?.response?.status === 429 && code === 'support_required') {
        enqueueSnackbar('5 başarısız deneme sonrası destek talebi oluşturuldu.', { variant: 'warning' })
      } else {
        enqueueSnackbar('Giriş başarısız', { variant: 'error' })
      }
    }
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
                  Giriş Yap
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                  Hesabına giriş yaparak tüm şablon ve çeviri araçlarına eriş.
                </Typography>
              </Stack>
              <TextField
                label="Kullanıcı Adı"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                sx={inputSx}
              />
              <TextField
                label="Şifre"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                sx={inputSx}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                    px: 4,
                  }}
                >
                  Giriş Yap
                </Button>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{
                    color: alpha('#fff', 0.8),
                    textDecoration: 'none',
                    '&:hover': { color: '#667eea' },
                  }}
                >
                  Şifremi unuttum
                </Link>
              </Stack>
              <Divider sx={{ borderColor: alpha('#667eea', 0.2) }} />
              <Button
                variant="outlined"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: alpha('#667eea', 0.5),
                  color: 'white',
                  '&:hover': { borderColor: '#667eea', background: alpha('#667eea', 0.1) },
                }}
              >
                Hesap oluştur
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  )
}

export default Login
