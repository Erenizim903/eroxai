import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography, alpha } from '@mui/material'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useAppStore } from '../store/useAppStore'
import TypewriterText from '../components/common/TypewriterText'

const themePresets = [
  { id: 'ocean', title: 'Ocean', primary: '#5B8CFF', secondary: '#30C48D' },
  { id: 'sunset', title: 'Sunset', primary: '#FF8F5B', secondary: '#F04438' },
  { id: 'violet', title: 'Violet', primary: '#8B5CF6', secondary: '#EC4899' },
  { id: 'emerald', title: 'Emerald', primary: '#10B981', secondary: '#06B6D4' },
]

const Themes = () => {
  const preset = useAppStore((state) => state.themePreset)
  const setPreset = useAppStore((state) => state.setThemePreset)

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <TypewriterText
            text="Temalar"
            variant="h3"
            speed={40}
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          />
          <Typography variant="body1" sx={{ color: alpha('#fff', 0.7) }}>
            Çalışma alanı için görsel temayı seç ve kişiselleştir.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {themePresets.map((item) => (
            <Grid item xs={12} md={3} key={item.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: alpha('#fff', 0.03),
                  border: `1px solid ${alpha('#667eea', 0.2)}`,
                  backdropFilter: 'blur(20px)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#667eea',
                    background: alpha('#667eea', 0.08),
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        height: 90,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${item.primary}, ${item.secondary})`,
                        border: `1px solid ${alpha('#fff', 0.15)}`,
                      }}
                    />
                    <Typography fontWeight={700} sx={{ color: 'white' }}>
                      {item.title}
                    </Typography>
                    <Button
                      variant={preset === item.id ? 'contained' : 'outlined'}
                      onClick={() => setPreset(item.id)}
                      sx={{
                        fontWeight: 700,
                        ...(preset === item.id
                          ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
                          : { borderColor: alpha('#667eea', 0.5), color: 'white' }),
                      }}
                    >
                      Seç
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}

export default Themes
