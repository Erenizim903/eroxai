import { useState } from 'react'
import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useAuthStore } from '../store/useAuthStore'

const Login = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login({ username, password })
      enqueueSnackbar('Giriş başarılı', { variant: 'success' })
      navigate('/dashboard')
    } catch (error) {
      enqueueSnackbar('Giriş başarısız', { variant: 'error' })
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Typography variant="h4">Giriş Yap</Typography>
            <TextField
              label="Kullanıcı Adı"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <TextField
              label="Şifre"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button variant="contained" type="submit" disabled={isLoading}>
              Giriş Yap
            </Button>
            <Button variant="text" onClick={() => navigate('/register')}>
              Hesap oluştur
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Login
