import { Box, Container, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <Box component="footer" sx={{ mt: 8, pb: 4 }}>
      <Divider sx={{ mb: 3 }} />
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
          <Box>
            <Typography variant="h6">EroxAI Document Studio</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.tagline')}
            </Typography>
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              support@eroxai.org
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.powered')}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
