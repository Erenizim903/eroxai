import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, alpha } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import TypewriterText from '../../components/common/TypewriterText'
import { fetchPremiumKeys, createPremiumKey } from '../../services/adminService'

const AdminPremiumKeys = () => {
  const [keys, setKeys] = useState([])
  const [form, setForm] = useState({ code: '', max_uses: 1 })
  const [loading, setLoading] = useState(false)
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
    const data = await fetchPremiumKeys()
    setKeys(data)
  }

  useEffect(() => {
    loadKeys().catch(() => {})
  }, [])

  const handleCreate = async () => {
    setLoading(true)
    try {
      await createPremiumKey(form)
      setForm({ code: '', max_uses: 1 })
      await loadKeys()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <TypewriterText
        text="Premium Key Yönetimi"
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
                Yeni Key
              </Typography>
              <Stack spacing={2}>
                <TextField label="Key (opsiyonel)" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} sx={inputSx} />
                <TextField
                  label="Maks Kullanım"
                  type="number"
                  value={form.max_uses}
                  onChange={(e) => setForm((p) => ({ ...p, max_uses: Number(e.target.value) || 1 }))}
                  sx={inputSx}
                />
                <Button variant="contained" onClick={handleCreate} disabled={loading}>
                  Key Oluştur
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                Key Listesi
              </Typography>
              <Stack spacing={2}>
                {keys.map((key) => (
                  <Card key={key.id} sx={{ p: 2, borderRadius: 2, background: alpha('#fff', 0.04), border: `1px solid ${alpha('#667eea', 0.15)}` }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                          {key.code}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                          {key.used_count}/{key.max_uses}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                ))}
                {keys.length === 0 && (
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                    Henüz key yok.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminPremiumKeys
