import { Box, Button, Container, Typography, alpha } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import TypewriterText from '../components/common/TypewriterText'

const NotFound = () => (
  <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
    <Navbar />
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <TypewriterText
        text="404"
        variant="h2"
        speed={50}
        sx={{
          fontWeight: 900,
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      />
      <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), mb: 4 }}>
        Aradığınız sayfa bulunamadı.
      </Typography>
      <Box>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 700,
            px: 4,
            py: 1.5,
          }}
        >
          Ana sayfaya dön
        </Button>
      </Box>
    </Container>
    <Footer />
  </Box>
)

export default NotFound
