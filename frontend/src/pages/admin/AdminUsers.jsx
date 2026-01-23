import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, alpha } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { createAdminUser, deleteAdminUser, fetchAdminUsers } from '../../services/adminService'
import TypewriterText from '../../components/common/TypewriterText'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ username: '', email: '', password: '', is_staff: false })
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

  const loadUsers = async () => {
    const data = await fetchAdminUsers()
    setUsers(data)
  }

  useEffect(() => {
    loadUsers().catch(() => {})
  }, [])

  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) return
    await createAdminUser(form)
    setForm({ username: '', email: '', password: '', is_staff: false })
    await loadUsers()
  }

  return (
    <Box>
      <TypewriterText
        text="Kullanıcılar"
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
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Yeni Kullanıcı
              </Typography>
              <Stack spacing={2}>
                <TextField label="Kullanıcı Adı" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} sx={inputSx} />
                <TextField label="E-posta" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} sx={inputSx} />
                <TextField label="Şifre" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} sx={inputSx} />
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                  }}
                >
                  Oluştur
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Kullanıcı Listesi
              </Typography>
              <Stack spacing={2}>
                {users.map((user) => (
                  <Card key={user.id} sx={{ p: 2, borderRadius: 2, background: alpha('#fff', 0.04), border: `1px solid ${alpha('#667eea', 0.15)}` }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                          {user.username}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                          {user.email}
                        </Typography>
                      </Box>
                      <Button color="error" size="small" onClick={() => deleteAdminUser(user.id).then(loadUsers)}>
                        Sil
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminUsers
