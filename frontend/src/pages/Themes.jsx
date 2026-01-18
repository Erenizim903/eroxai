import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useAppStore } from '../store/useAppStore'

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
    <Stack>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Temalar
        </Typography>
        <Grid container spacing={3}>
          {themePresets.map((item) => (
            <Grid item xs={12} md={3} key={item.id}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        height: 80,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${item.primary}, ${item.secondary})`,
                      }}
                    />
                    <Typography fontWeight={600}>{item.title}</Typography>
                    <Button
                      variant={preset === item.id ? 'contained' : 'outlined'}
                      onClick={() => setPreset(item.id)}
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
    </Stack>
  )
}

export default Themes
