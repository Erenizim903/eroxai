import { Box, Card, CardContent, Grid, Stack, Typography, alpha, Chip } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import StarIcon from '@mui/icons-material/Star'
import DescriptionIcon from '@mui/icons-material/Description'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { useEffect, useState } from 'react'
import { fetchAdminAnalytics } from '../../services/adminService'
import TypewriterText from '../../components/common/TypewriterText'

const StatCard = ({ label, value, icon, color }) => (
  <Card
    sx={{
      p: 3,
      borderRadius: 3,
      background: alpha('#fff', 0.03),
      border: `1px solid ${alpha('#667eea', 0.2)}`,
      backdropFilter: 'blur(18px)',
    }}
  >
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 800 }}>
            {value}
          </Typography>
        </Stack>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            background: alpha(color || '#667eea', 0.2),
            color: color || '#667eea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
)

const AdminOverview = () => {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchAdminAnalytics().then(setAnalytics).catch(() => {})
  }, [])

  return (
    <Box>
      <TypewriterText
        text="Genel Bakış"
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
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Chip label="Live" sx={{ background: alpha('#10B981', 0.2), color: '#10B981', fontWeight: 600 }} />
        <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
          Admin panelinin canlı metrikleri
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Toplam Kullanıcı"
            value={analytics?.overview?.total_users || 0}
            icon={<PeopleIcon />}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Premium Kullanıcı"
            value={analytics?.overview?.premium_users || 0}
            icon={<StarIcon />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Toplam Şablon"
            value={analytics?.overview?.total_templates || 0}
            icon={<DescriptionIcon />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            label="Toplam Belge"
            value={analytics?.overview?.total_documents || 0}
            icon={<FileCopyIcon />}
            color="#8B5CF6"
          />
        </Grid>
      </Grid>
      <Stack sx={{ mt: 4 }} spacing={2}>
        <Typography variant="body1" sx={{ color: alpha('#fff', 0.7) }}>
          Buradan admin panelin ana metriklerini izleyebilir ve menülerden detaylı sayfalara geçebilirsiniz.
        </Typography>
      </Stack>
    </Box>
  )
}

export default AdminOverview
