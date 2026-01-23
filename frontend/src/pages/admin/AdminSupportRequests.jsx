import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography, alpha } from '@mui/material'
import { useEffect, useState } from 'react'
import TypewriterText from '../../components/common/TypewriterText'
import { fetchSupportRequests, updateSupportRequest } from '../../services/adminService'

const statusMap = {
  pending: { label: 'Bekliyor', color: '#F59E0B' },
  resolved: { label: 'Çözüldü', color: '#10B981' },
  rejected: { label: 'Reddedildi', color: '#F04438' },
}

const AdminSupportRequests = () => {
  const [items, setItems] = useState([])

  const loadRequests = async () => {
    const data = await fetchSupportRequests()
    setItems(data)
  }

  useEffect(() => {
    loadRequests().catch(() => {})
  }, [])

  const setStatus = async (id, status) => {
    await updateSupportRequest(id, { status })
    await loadRequests()
  }

  return (
    <Box>
      <TypewriterText
        text="Destek Talepleri"
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
        {items.map((item) => {
          const meta = statusMap[item.status] || statusMap.pending
          return (
            <Grid item xs={12} md={6} key={item.id}>
              <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
                        {item.username || item.email || 'Bilinmeyen kullanıcı'}
                      </Typography>
                      <Chip label={meta.label} sx={{ background: alpha(meta.color, 0.2), color: meta.color }} />
                    </Stack>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                      {item.reason || '5 başarısız giriş denemesi sonrası otomatik talep.'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                      {item.created_at}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => setStatus(item.id, 'resolved')}>
                        Çözüldü
                      </Button>
                      <Button size="small" color="error" onClick={() => setStatus(item.id, 'rejected')}>
                        Reddet
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
        {items.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                  Henüz destek talebi yok.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default AdminSupportRequests
