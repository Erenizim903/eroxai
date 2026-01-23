import { useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Container, Divider, Link, Stack, TextField, Typography, alpha } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { registerUser } from '../services/authService'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const Register = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
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
      await registerUser({
        username,
        email,
        password,
        verifyBaseUrl: window.location.origin,
      })
      enqueueSnackbar('Kayıt başarılı, doğrulama maili gönderildi.', { variant: 'success' })
      navigate('/login')
    } catch (error) {
      enqueueSnackbar('Kayıt başarısız', { variant: 'error' })
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
                  Kayıt Ol
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                  Hesabını oluştur, şablon ve çeviri araçlarına eriş.
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
                label="E-posta"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
              <Button
                variant="contained"
                type="submit"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 700,
                }}
              >
                Kayıt Ol
              </Button>
              <Divider sx={{ borderColor: alpha('#667eea', 0.2) }} />
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: alpha('#fff', 0.8),
                  textDecoration: 'none',
                  '&:hover': { color: '#667eea' },
                }}
              >
                Zaten hesabın var mı? Giriş yap
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  )
}

export default Register
