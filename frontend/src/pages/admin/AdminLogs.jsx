import { Box, Card, CardContent, Grid, Stack, Typography, alpha, Chip } from '@mui/material'
import { useEffect, useState } from 'react'
import { fetchAdminLogs, fetchAdminActivityLogs } from '../../services/adminService'
import TypewriterText from '../../components/common/TypewriterText'

const AdminLogs = () => {
  const [usageLogs, setUsageLogs] = useState([])
  const [activityLogs, setActivityLogs] = useState([])

  useEffect(() => {
    fetchAdminLogs().then(setUsageLogs).catch(() => {})
    fetchAdminActivityLogs().then(setActivityLogs).catch(() => {})
  }, [])

  return (
    <Box>
      <TypewriterText
        text="Loglar"
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
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  Kullanım Logları
                </Typography>
                <Chip label={`${usageLogs.length} kayıt`} size="small" sx={{ background: alpha('#667eea', 0.2), color: '#fff' }} />
              </Stack>
              <Stack spacing={2}>
                {usageLogs.length === 0 && (
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                    Henüz kullanım logu yok.
                  </Typography>
                )}
                {usageLogs.map((log) => (
                  <Card key={log.id} sx={{ p: 2, borderRadius: 2, background: alpha('#fff', 0.04), border: `1px solid ${alpha('#667eea', 0.15)}` }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {log.user} · {log.action}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                      {log.created_at}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, background: alpha('#fff', 0.03), border: `1px solid ${alpha('#667eea', 0.2)}`, backdropFilter: 'blur(18px)' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  Aktivite Logları
                </Typography>
                <Chip label={`${activityLogs.length} kayıt`} size="small" sx={{ background: alpha('#10B981', 0.2), color: '#10B981' }} />
              </Stack>
              <Stack spacing={2}>
                {activityLogs.length === 0 && (
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                    Henüz aktivite logu yok.
                  </Typography>
                )}
                {activityLogs.map((log) => (
                  <Card key={log.id} sx={{ p: 2, borderRadius: 2, background: alpha('#fff', 0.04), border: `1px solid ${alpha('#667eea', 0.15)}` }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {log.username} · {log.action}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                      {log.created_at}
                    </Typography>
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

export default AdminLogs
