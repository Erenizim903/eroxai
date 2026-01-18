import { Box, Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const NotFound = () => (
  <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
    <Typography variant="h3" sx={{ mb: 2 }}>
      404
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Aradığınız sayfa bulunamadı.
    </Typography>
    <Box>
      <Button component={RouterLink} to="/" variant="contained">
        Ana sayfaya dön
      </Button>
    </Box>
  </Container>
)

export default NotFound
