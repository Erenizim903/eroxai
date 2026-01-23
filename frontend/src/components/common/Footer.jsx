import { Box, Container, Divider, Grid, IconButton, Stack, Typography, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSiteStore } from '../../store/useSiteStore'
import { useEffect } from 'react'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'
import GitHubIcon from '@mui/icons-material/GitHub'
import TelegramIcon from '@mui/icons-material/Telegram'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

const SocialIconButton = ({ icon, href, color }) => (
  <motion.div whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.9 }}>
    <IconButton
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: color || 'primary.main',
        border: `1px solid ${alpha(color || '#667eea', 0.3)}`,
        '&:hover': {
          background: alpha(color || '#667eea', 0.15),
          borderColor: color || '#667eea',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      {icon}
    </IconButton>
  </motion.div>
)

const Footer = () => {
  const { t } = useTranslation()
  const siteSettings = useSiteStore((state) => state.settings)
  const loadSettings = useSiteStore((state) => state.loadSettings)
  const brandName =
    siteSettings?.site_name === 'EroxAI' ? 'EroxAI Studio' : siteSettings?.site_name || 'EroxAI Studio'

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const socialLinks = [
    { icon: <FacebookIcon />, url: siteSettings?.social_facebook, color: '#1877F2' },
    { icon: <InstagramIcon />, url: siteSettings?.social_instagram, color: '#E4405F' },
    { icon: <TwitterIcon />, url: siteSettings?.social_twitter, color: '#1DA1F2' },
    { icon: <LinkedInIcon />, url: siteSettings?.social_linkedin, color: '#0077B5' },
    { icon: <YouTubeIcon />, url: siteSettings?.social_youtube, color: '#FF0000' },
    { icon: <GitHubIcon />, url: siteSettings?.social_github, color: '#181717' },
    { icon: <TelegramIcon />, url: siteSettings?.social_telegram, color: '#0088CC' },
  ].filter((link) => link.url)

  return (
    <Box
      component="footer"
      sx={{
        mt: 12,
        pb: 6,
        pt: 8,
        background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.5) 0%, rgba(10, 10, 10, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${alpha('#667eea', 0.2)}`,
      }}
    >
      <Divider sx={{ mb: 6, borderColor: alpha('#667eea', 0.2) }} />
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                {brandName}
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                {t('footer.tagline')}
              </Typography>
              {socialLinks.length > 0 && (
                <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                  {socialLinks.map((link, idx) => (
                    <SocialIconButton key={idx} icon={link.icon} href={link.url} color={link.color} />
                  ))}
                </Stack>
              )}
            </Stack>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                İletişim
              </Typography>
              <Stack spacing={2}>
                {siteSettings?.contact_email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon sx={{ color: '#667eea', fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha('#fff', 0.8),
                        cursor: 'pointer',
                        '&:hover': { color: '#667eea' },
                      }}
                      onClick={() => window.open(`mailto:${siteSettings.contact_email}`)}
                    >
                      {siteSettings.contact_email}
                    </Typography>
                  </Box>
                )}
                {siteSettings?.contact_phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PhoneIcon sx={{ color: '#667eea', fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha('#fff', 0.8),
                        cursor: 'pointer',
                        '&:hover': { color: '#667eea' },
                      }}
                      onClick={() => window.open(`tel:${siteSettings.contact_phone}`)}
                    >
                      {siteSettings.contact_phone}
                    </Typography>
                  </Box>
                )}
                {siteSettings?.contact_whatsapp && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha('#fff', 0.8),
                        cursor: 'pointer',
                        '&:hover': { color: '#25D366' },
                      }}
                      onClick={() => window.open(`https://wa.me/${siteSettings.contact_whatsapp.replace(/\D/g, '')}`)}
                    >
                      {siteSettings.contact_whatsapp}
                    </Typography>
                  </Box>
                )}
                {siteSettings?.address && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                      {siteSettings.address}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                Hızlı Linkler
              </Typography>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  component="a"
                  href="/"
                  sx={{
                    color: alpha('#fff', 0.8),
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: '#667eea' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  Ana Sayfa
                </Typography>
                <Typography
                  variant="body2"
                  component="a"
                  href="/dashboard"
                  sx={{
                    color: alpha('#fff', 0.8),
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: '#667eea' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  Dashboard
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha('#fff', 0.8),
                    cursor: 'pointer',
                    '&:hover': { color: '#667eea' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {t('footer.powered')}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: alpha('#667eea', 0.2) }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
            {siteSettings?.copyright_text || '© 2026 EroxAI Studio. Tüm hakları saklıdır.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
