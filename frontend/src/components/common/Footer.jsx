import { Box, Container, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSiteStore } from '../../store/useSiteStore'
import { useEffect } from 'react'

const Footer = () => {
  const { t } = useTranslation()
  const siteSettings = useSiteStore((state) => state.settings)
  const loadSettings = useSiteStore((state) => state.loadSettings)

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <Box component="footer" sx={{ mt: 8, pb: 4 }}>
      <Divider sx={{ mb: 3 }} />
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
          <Box>
            <Typography variant="h6">{siteSettings?.site_name || 'EroxAI Document Studio'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.tagline')}
            </Typography>
          </Box>
          <Stack spacing={0.5}>
            {siteSettings?.contact_email && (
              <Typography variant="body2" color="text.secondary">
                {siteSettings.contact_email}
              </Typography>
            )}
            {siteSettings?.contact_phone && (
              <Typography variant="body2" color="text.secondary">
                {siteSettings.contact_phone}
              </Typography>
            )}
            {siteSettings?.contact_whatsapp && (
              <Typography variant="body2" color="text.secondary">
                WhatsApp: {siteSettings.contact_whatsapp}
              </Typography>
            )}
            {siteSettings?.address && (
              <Typography variant="body2" color="text.secondary">
                {siteSettings.address}
              </Typography>
            )}
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
