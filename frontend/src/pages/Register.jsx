import { useState } from 'react'
import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { registerUser } from '../services/authService'

const Register = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Typography variant="h4">Kayıt Ol</Typography>
            <TextField
              label="Kullanıcı Adı"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <TextField
              label="E-posta"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <TextField
              label="Şifre"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button variant="contained" type="submit">
              Kayıt Ol
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Register
