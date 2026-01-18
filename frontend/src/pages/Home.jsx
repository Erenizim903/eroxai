import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import BoltIcon from '@mui/icons-material/Bolt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import LanguageIcon from '@mui/icons-material/Language'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import KeyIcon from '@mui/icons-material/Key'
import PersonIcon from '@mui/icons-material/Person'
import InfoIcon from '@mui/icons-material/Info'
import BuildIcon from '@mui/icons-material/Build'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'
import GitHubIcon from '@mui/icons-material/GitHub'
import TelegramIcon from '@mui/icons-material/Telegram'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import StarIcon from '@mui/icons-material/Star'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AnimatedText from '../components/common/AnimatedText'
import TypewriterText from '../components/common/TypewriterText'
import AnimatedBackground from '../components/common/AnimatedBackground'
import SectionTitle from '../components/common/SectionTitle'
import { useSiteStore } from '../store/useSiteStore'

const FloatingCard = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    {...props}
  >
    {children}
  </motion.div>
)

const SocialIconButton = ({ icon, href, color }) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    <IconButton
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: color || 'primary.main',
        border: `1px solid ${alpha(color || '#667eea', 0.3)}`,
        '&:hover': {
          background: alpha(color || '#667eea', 0.1),
          borderColor: color || '#667eea',
        },
      }}
    >
      {icon}
    </IconButton>
  </motion.div>
)

const Home = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const siteSettings = useSiteStore((state) => state.settings)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

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
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <AnimatedBackground />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        
        {/* Hero Section - Ultra Modern */}
        <Box ref={heroRef} sx={{ position: 'relative', pt: { xs: 8, md: 16 }, pb: { xs: 12, md: 20 }, minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
          <motion.div style={{ opacity, scale }}>
            <Container maxWidth="lg">
              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Stack spacing={4}>
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Chip
                        label="✨ 2026'nın En Gelişmiş Platformu"
                        sx={{
                          mb: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          px: 2,
                          py: 2.5,
                        }}
                      />
                      <TypewriterText
                        text={siteSettings?.hero_title || t('home.hero.title')}
                        variant="h1"
                        speed={30}
                        sx={{
                          fontSize: { xs: '2.5rem', md: '4.5rem', lg: '5.5rem' },
                          fontWeight: 900,
                          lineHeight: 1.1,
                          mb: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      />
                      <AnimatedText
                        variant="h5"
                        delay={1}
                        sx={{
                          color: alpha('#fff', 0.8),
                          mb: 4,
                          lineHeight: 1.8,
                          fontSize: { xs: '1.1rem', md: '1.3rem' },
                        }}
                      >
                        {siteSettings?.hero_subtitle || t('home.hero.subtitle')}
                      </AnimatedText>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            component={RouterLink}
                            to="/dashboard"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              px: 5,
                              py: 1.8,
                              borderRadius: 3,
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                boxShadow: '0 25px 50px rgba(102, 126, 234, 0.5)',
                              },
                            }}
                          >
                            {t('home.hero.ctaPrimary')}
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outlined"
                            size="large"
                            sx={{
                              px: 5,
                              py: 1.8,
                              borderRadius: 3,
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              borderWidth: 2,
                              borderColor: alpha('#667eea', 0.5),
                              color: 'white',
                              '&:hover': {
                                borderWidth: 2,
                                borderColor: '#667eea',
                                background: alpha('#667eea', 0.1),
                              },
                            }}
                          >
                            {t('home.hero.ctaSecondary')}
                          </Button>
                        </motion.div>
                      </Stack>
                      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                        {[
                          { icon: <SpeedIcon />, text: 'Hızlı İşlem' },
                          { icon: <SecurityIcon />, text: 'Güvenli Sistem' },
                          { icon: <VerifiedUserIcon />, text: 'Doğrulanmış' },
                        ].map((benefit, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                          >
                            <Chip
                              icon={benefit.icon}
                              label={benefit.text}
                              sx={{
                                background: alpha('#667eea', 0.15),
                                color: '#fff',
                                fontWeight: 600,
                                border: `1px solid ${alpha('#667eea', 0.3)}`,
                              }}
                            />
                          </motion.div>
                        ))}
                      </Stack>
                      {socialLinks.length > 0 && (
                        <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
                          {socialLinks.map((link, idx) => (
                            <SocialIconButton key={idx} icon={link.icon} href={link.url} color={link.color} />
                          ))}
                        </Stack>
                      )}
                    </motion.div>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Card
                        sx={{
                          p: 4,
                          backdropFilter: 'blur(30px)',
                          background: alpha('#fff', 0.05),
                          border: `1px solid ${alpha('#667eea', 0.3)}`,
                          borderRadius: 4,
                          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                        }}
                      >
                        <CardContent>
                          <Stack spacing={4}>
                            <Box
                              sx={{
                                width: '100%',
                                height: 300,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                              }}
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                style={{ position: 'absolute', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
                              />
                              <AutoAwesomeIcon sx={{ fontSize: 100, color: 'white', zIndex: 1 }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', textAlign: 'center' }}>
                              {t('home.hero.demoTitle')}
                            </Typography>
                            <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), textAlign: 'center', lineHeight: 1.8 }}>
                              {t('home.hero.demoDesc')}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
          </motion.div>
        </Box>

        {/* Features Section - Premium Design */}
        <Box sx={{ py: { xs: 10, md: 16 }, position: 'relative' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Chip label="Özellikler" sx={{ mb: 2, background: alpha('#667eea', 0.2), color: '#fff' }} />
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                  {t('home.features.title')}
                </Typography>
                <Typography variant="h6" sx={{ color: alpha('#fff', 0.7), maxWidth: 600, mx: 'auto' }}>
                  {t('home.features.subtitle')}
                </Typography>
              </Box>
            </motion.div>
            <Grid container spacing={4}>
              {[
                {
                  icon: <AutoAwesomeIcon sx={{ fontSize: 50 }} />,
                  title: t('home.features.ocr.title'),
                  desc: t('home.features.ocr.desc'),
                  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#667eea',
                },
                {
                  icon: <LanguageIcon sx={{ fontSize: 50 }} />,
                  title: t('home.features.translate.title'),
                  desc: t('home.features.translate.desc'),
                  gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  color: '#10B981',
                },
                {
                  icon: <BoltIcon sx={{ fontSize: 50 }} />,
                  title: t('home.features.fast.title'),
                  desc: t('home.features.fast.desc'),
                  gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: '#F59E0B',
                },
              ].map((feature, idx) => (
                <Grid key={idx} item xs={12} md={4}>
                  <FloatingCard delay={idx * 0.15}>
                    <Card
                      sx={{
                        height: '100%',
                        p: 4,
                        borderRadius: 4,
                        background: alpha('#fff', 0.03),
                        border: `1px solid ${alpha(feature.color, 0.2)}`,
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s ease',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          borderColor: feature.color,
                          boxShadow: `0 30px 60px ${alpha(feature.color, 0.3)}`,
                          background: alpha('#fff', 0.05),
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={3}>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 3,
                              background: feature.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              boxShadow: `0 15px 35px ${alpha(feature.color, 0.4)}`,
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                            {feature.desc}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Usage Steps - Modern Cards */}
        <Box sx={{ py: { xs: 10, md: 16 }, background: alpha('#667eea', 0.05) }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Chip label="Nasıl Çalışır?" sx={{ mb: 2, background: alpha('#667eea', 0.2), color: '#fff' }} />
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                  {t('home.steps.title')}
                </Typography>
                <Typography variant="h6" sx={{ color: alpha('#fff', 0.7), maxWidth: 600, mx: 'auto' }}>
                  {t('home.steps.subtitle')}
                </Typography>
              </Box>
            </motion.div>
            <Grid container spacing={4}>
              {[
                { num: '01', title: t('home.steps.step1.title'), desc: t('home.steps.step1.desc'), icon: <CloudUploadIcon /> },
                { num: '02', title: t('home.steps.step2.title'), desc: t('home.steps.step2.desc'), icon: <AutoAwesomeIcon /> },
                { num: '03', title: t('home.steps.step3.title'), desc: t('home.steps.step3.desc'), icon: <DownloadIcon /> },
              ].map((step, idx) => (
                <Grid key={idx} item xs={12} md={4}>
                  <FloatingCard delay={idx * 0.2}>
                    <Card
                      sx={{
                        height: '100%',
                        p: 4,
                        borderRadius: 4,
                        background: alpha('#fff', 0.03),
                        border: `1px solid ${alpha('#667eea', 0.2)}`,
                        backdropFilter: 'blur(20px)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          borderColor: '#667eea',
                          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 4,
                          height: '100%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography
                              variant="h1"
                              sx={{
                                fontSize: '5rem',
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1,
                              }}
                            >
                              {step.num}
                            </Typography>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                ml: 'auto',
                              }}
                            >
                              {step.icon}
                            </Box>
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            {step.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                            {step.desc}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Usage Guide Section */}
        <Box sx={{ py: { xs: 10, md: 16 } }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Chip label="Kullanım Kılavuzu" sx={{ mb: 2, background: alpha('#667eea', 0.2), color: '#fff' }} />
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                  Detaylı Kullanım Rehberi
                </Typography>
                <Typography variant="h6" sx={{ color: alpha('#fff', 0.7), maxWidth: 600, mx: 'auto' }}>
                  Adım adım nasıl kullanacağınızı öğrenin
                </Typography>
              </Box>
            </motion.div>
            <Grid container spacing={4}>
              {[
                {
                  num: 1,
                  title: 'Kayıt Ol ve Doğrula',
                  desc: 'Ücretsiz hesap oluşturun. Email doğrulaması yaparak hesabınızı aktif edin. İlk 5 kullanım tamamen ücretsizdir.',
                  color: '#667eea',
                },
                {
                  num: 2,
                  title: 'Belge Yükle ve İşle',
                  desc: 'Hazır şablonlardan birini seçin veya yeni bir şablon oluşturun. PDF, Excel veya boş sayfa formatlarını destekler.',
                  color: '#11998e',
                },
                {
                  num: 3,
                  title: 'Sonuçları İndir',
                  desc: 'İhtiyacınız olan bilgileri girin. Sistem otomatik olarak Japonca formata dönüştürür ve hazır belgeyi oluşturur.',
                  color: '#f5576c',
                },
              ].map((item, idx) => (
                <Grid key={idx} item xs={12} md={4}>
                  <FloatingCard delay={idx * 0.1}>
                    <Card
                      sx={{
                        height: '100%',
                        p: 4,
                        borderRadius: 4,
                        background: alpha('#fff', 0.03),
                        border: `1px solid ${alpha(item.color, 0.2)}`,
                        backdropFilter: 'blur(20px)',
                        '&:hover': {
                          borderColor: item.color,
                          boxShadow: `0 20px 40px ${alpha(item.color, 0.3)}`,
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={3}>
                          <Box
                            sx={{
                              width: 70,
                              height: 70,
                              borderRadius: 3,
                              background: `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color, 0.6)} 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              boxShadow: `0 15px 35px ${alpha(item.color, 0.4)}`,
                            }}
                          >
                            <Typography variant="h3" sx={{ fontWeight: 900 }}>
                              {item.num}
                            </Typography>
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                            {item.desc}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Premium Key Section */}
        <Box sx={{ py: { xs: 10, md: 16 }, background: alpha('#667eea', 0.08) }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Chip label="Premium" sx={{ mb: 2, background: alpha('#667eea', 0.2), color: '#fff' }} />
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                  Premium Key Nasıl Alınır?
                </Typography>
                <Typography variant="h6" sx={{ color: alpha('#fff', 0.7), maxWidth: 600, mx: 'auto' }}>
                  Sınırsız kullanım ve tüm premium özellikler için
                </Typography>
              </Box>
            </motion.div>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FloatingCard delay={0}>
                  <Card
                    sx={{
                      p: 5,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 30px 60px rgba(102, 126, 234, 0.4)',
                    }}
                  >
                    <CardContent>
                      <Stack spacing={4}>
                        <KeyIcon sx={{ fontSize: 60 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                          Premium Key Alımı
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.9, opacity: 0.95, fontSize: '1.1rem' }}>
                          Premium key'ler admin panel üzerinden oluşturulur. Key almak için iletişim bölümünden
                          bize ulaşın veya admin hesabınız varsa admin panelden key oluşturabilirsiniz.
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <StarIcon sx={{ color: '#FFD700' }} />
                            <Typography variant="body1" sx={{ opacity: 0.95 }}>
                              Sınırsız kullanım hakkı
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <StarIcon sx={{ color: '#FFD700' }} />
                            <Typography variant="body1" sx={{ opacity: 0.95 }}>
                              Tüm premium özellikler
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <StarIcon sx={{ color: '#FFD700' }} />
                            <Typography variant="body1" sx={{ opacity: 0.95 }}>
                              Öncelikli destek
                            </Typography>
                          </Box>
                        </Stack>
                        {siteSettings?.contact_email && (
                          <Button
                            variant="contained"
                            startIcon={<EmailIcon />}
                            href={`mailto:${siteSettings.contact_email}?subject=Premium Key Talebi`}
                            sx={{
                              mt: 2,
                              background: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              py: 1.5,
                              fontSize: '1rem',
                              fontWeight: 600,
                              '&:hover': { background: 'rgba(255,255,255,0.3)' },
                            }}
                          >
                            Email ile İletişime Geç
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </FloatingCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <FloatingCard delay={0.2}>
                  <Card
                    sx={{
                      p: 5,
                      borderRadius: 4,
                      height: '100%',
                      background: alpha('#fff', 0.03),
                      border: `1px solid ${alpha('#667eea', 0.3)}`,
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <CardContent>
                      <Stack spacing={4}>
                        <Chip
                          label="Key Kullanımı"
                          color="primary"
                          icon={<KeyIcon />}
                          sx={{ alignSelf: 'flex-start', background: alpha('#667eea', 0.2), color: '#fff' }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                          Key'i Nasıl Kullanırım?
                        </Typography>
                        <Stack spacing={2}>
                          {[
                            'Premium key\'inizi aldıktan sonra, Dashboard sekmesine gidin.',
                            '"Premium Key Kullan" bölümünde key\'inizi girin.',
                            'Key doğrulandıktan sonra premium özellikler aktif olur.',
                            'Artık sınırsız kullanım yapabilirsiniz!',
                          ].map((text, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <CheckCircleIcon sx={{ color: '#10B981', mt: 0.5 }} />
                              <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), lineHeight: 1.8 }}>
                                {text}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            component={RouterLink}
                            to="/dashboard"
                            variant="contained"
                            size="large"
                            fullWidth
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              mt: 2,
                              py: 1.5,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '1rem',
                              fontWeight: 600,
                            }}
                          >
                            Dashboard'a Git
                          </Button>
                        </motion.div>
                      </Stack>
                    </CardContent>
                  </Card>
                </FloatingCard>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* About/Founder Section */}
        <Box sx={{ py: { xs: 10, md: 16 } }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Chip label="Hakkımızda" sx={{ mb: 2, background: alpha('#667eea', 0.2), color: '#fff' }} />
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                  Proje Hakkında
                </Typography>
                <Typography variant="h6" sx={{ color: alpha('#fff', 0.7), maxWidth: 600, mx: 'auto' }}>
                  Platform ve kurucu bilgileri
                </Typography>
              </Box>
            </motion.div>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FloatingCard delay={0}>
                  <Card
                    sx={{
                      p: 5,
                      borderRadius: 4,
                      height: '100%',
                      background: alpha('#fff', 0.03),
                      border: `1px solid ${alpha('#667eea', 0.2)}`,
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <CardContent>
                      <Stack spacing={4}>
                        <InfoIcon sx={{ fontSize: 60, color: '#667eea' }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                          Platform Hakkında
                        </Typography>
                        <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), lineHeight: 1.9, fontSize: '1.05rem' }}>
                          EroxAI Studio, 2026 yılında geliştirilen profesyonel belge oluşturma platformudur.
                          Fiş kesme, sözleşme doldurma, zehirli atık belgeleri ve diğer resmi evrakları 
                          hızlı ve kolay bir şekilde oluşturmanızı sağlar.
                        </Typography>
                        <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), lineHeight: 1.9, fontSize: '1.05rem' }}>
                          Platform, hazır şablonlar, otomatik Japonca format dönüşümü ve kullanıcı dostu arayüzü ile
                          iş süreçlerinizi hızlandırır.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </FloatingCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <FloatingCard delay={0.2}>
                  <Card
                    sx={{
                      p: 5,
                      borderRadius: 4,
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                      border: `1px solid ${alpha('#667eea', 0.3)}`,
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <CardContent>
                      <Stack spacing={4}>
                        <PersonIcon sx={{ fontSize: 60, color: '#667eea' }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                          Kurucu
                        </Typography>
                        <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), lineHeight: 1.9, fontSize: '1.05rem' }}>
                          Bu platform, modern web teknolojileri ve yapay zeka kullanarak doküman işleme alanında
                          yenilikçi çözümler sunmak amacıyla geliştirilmiştir.
                        </Typography>
                        <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), lineHeight: 1.9, fontSize: '1.05rem' }}>
                          Kullanıcı deneyimini ön planda tutarak, sürekli geliştirme ve güncelleme yapılmaktadır.
                        </Typography>
                        {siteSettings?.contact_email && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 2, fontWeight: 600 }}>
                              İletişim:
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1.5}>
                              {siteSettings.contact_email && (
                                <Chip
                                  icon={<EmailIcon />}
                                  label="Email"
                                  sx={{
                                    cursor: 'pointer',
                                    background: alpha('#667eea', 0.2),
                                    color: '#fff',
                                    '&:hover': { background: alpha('#667eea', 0.3) },
                                  }}
                                  onClick={() => window.open(`mailto:${siteSettings.contact_email}`)}
                                />
                              )}
                              {siteSettings.contact_phone && (
                                <Chip
                                  icon={<PhoneIcon />}
                                  label="Telefon"
                                  sx={{
                                    cursor: 'pointer',
                                    background: alpha('#667eea', 0.2),
                                    color: '#fff',
                                    '&:hover': { background: alpha('#667eea', 0.3) },
                                  }}
                                  onClick={() => window.open(`tel:${siteSettings.contact_phone}`)}
                                />
                              )}
                              {siteSettings.contact_whatsapp && (
                                <Chip
                                  icon={<WhatsAppIcon />}
                                  label="WhatsApp"
                                  sx={{
                                    cursor: 'pointer',
                                    background: alpha('#667eea', 0.2),
                                    color: '#fff',
                                    '&:hover': { background: alpha('#667eea', 0.3) },
                                  }}
                                  onClick={() => window.open(`https://wa.me/${siteSettings.contact_whatsapp.replace(/\D/g, '')}`)}
                                />
                              )}
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </FloatingCard>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Development Status Section */}
        <Box sx={{ py: { xs: 10, md: 16 }, background: alpha('#F59E0B', 0.08) }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Chip label="Geliştirme Durumu" sx={{ mb: 2, background: alpha('#F59E0B', 0.2), color: '#fff' }} />
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                  Platform Geliştirme Aşaması
                </Typography>
                <Typography variant="h6" sx={{ color: alpha('#fff', 0.7), maxWidth: 600, mx: 'auto' }}>
                  Sürekli geliştirilen özellikler ve yol haritası
                </Typography>
              </Box>
            </motion.div>
            <Grid container spacing={3}>
              {[
                { title: 'Belge Şablon Sistemi', status: 'Aktif', progress: 100, color: '#10B981' },
                { title: 'Japonca Format Dönüşümü', status: 'Aktif', progress: 100, color: '#10B981' },
                { title: 'Fiş/Sözleşme Modülleri', status: 'Aktif', progress: 100, color: '#10B981' },
                { title: 'Zehirli Atık Belge Sistemi', status: 'Aktif', progress: 100, color: '#10B981' },
                { title: 'Admin Panel', status: 'Aktif', progress: 100, color: '#10B981' },
                { title: 'Gelişmiş Şablon Editörü', status: 'Geliştirme Aşamasında', progress: 75, color: '#F59E0B' },
                { title: 'Toplu Belge Oluşturma', status: 'Geliştirme Aşamasında', progress: 60, color: '#F59E0B' },
                { title: 'Mobil Uygulama', status: 'Planlanıyor', progress: 20, color: '#EF4444' },
              ].map((item, idx) => (
                <Grid key={idx} item xs={12} md={6}>
                  <FloatingCard delay={idx * 0.1}>
                    <Card
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: alpha('#fff', 0.03),
                        border: `1px solid ${alpha(item.color, 0.2)}`,
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                              {item.title}
                            </Typography>
                            <Chip
                              label={item.status}
                              size="small"
                              sx={{
                                background: alpha(item.color, 0.2),
                                color: item.color,
                                fontWeight: 600,
                                border: `1px solid ${alpha(item.color, 0.3)}`,
                              }}
                            />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                                İlerleme
                              </Typography>
                              <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), fontWeight: 600 }}>
                                {item.progress}%
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                height: 10,
                                borderRadius: 5,
                                background: alpha(item.color, 0.1),
                                overflow: 'hidden',
                              }}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.progress}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: idx * 0.1 }}
                                style={{
                                  height: '100%',
                                  background: item.color,
                                  borderRadius: 5,
                                }}
                              />
                            </Box>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 8, textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    p: 6,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                    border: `2px dashed ${alpha('#667eea', 0.4)}`,
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <BuildIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                    Platform Sürekli Geliştirilmektedir
                  </Typography>
                  <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), lineHeight: 1.9, maxWidth: 700, mx: 'auto' }}>
                    Yeni özellikler, iyileştirmeler ve güncellemeler düzenli olarak eklenmektedir. Önerileriniz için
                    bizimle iletişime geçebilirsiniz.
                  </Typography>
                </Card>
              </motion.div>
            </Box>
          </Container>
        </Box>

        {/* Contact Section */}
        {siteSettings?.contact_email || siteSettings?.contact_phone || siteSettings?.contact_whatsapp ? (
          <Box sx={{ py: { xs: 10, md: 16 } }}>
            <Container maxWidth="lg">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                  <Chip label="İletişim" sx={{ mb: 2, background: alpha('#667eea', 0.2), color: '#fff' }} />
                  <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                    {t('home.contact.title')}
                  </Typography>
                  <Typography variant="h6" sx={{ color: alpha('#fff', 0.7), maxWidth: 600, mx: 'auto' }}>
                    {t('home.contact.subtitle')}
                  </Typography>
                </Box>
              </motion.div>
              <Grid container spacing={3}>
                {siteSettings?.contact_email && (
                  <Grid item xs={12} md={4}>
                    <FloatingCard delay={0}>
                      <Card
                        sx={{
                          textAlign: 'center',
                          p: 4,
                          borderRadius: 4,
                          background: alpha('#fff', 0.03),
                          border: `1px solid ${alpha('#667eea', 0.2)}`,
                          backdropFilter: 'blur(20px)',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)', borderColor: '#667eea' },
                        }}
                      >
                        <CardContent>
                          <EmailIcon sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: 'white' }}>
                            Email
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#667eea', fontWeight: 500 }}>
                            {siteSettings.contact_email}
                          </Typography>
                        </CardContent>
                      </Card>
                    </FloatingCard>
                  </Grid>
                )}
                {siteSettings?.contact_phone && (
                  <Grid item xs={12} md={4}>
                    <FloatingCard delay={0.1}>
                      <Card
                        sx={{
                          textAlign: 'center',
                          p: 4,
                          borderRadius: 4,
                          background: alpha('#fff', 0.03),
                          border: `1px solid ${alpha('#667eea', 0.2)}`,
                          backdropFilter: 'blur(20px)',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)', borderColor: '#667eea' },
                        }}
                      >
                        <CardContent>
                          <PhoneIcon sx={{ fontSize: 50, color: '#667eea', mb: 2 }} />
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: 'white' }}>
                            Telefon
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#667eea', fontWeight: 500 }}>
                            {siteSettings.contact_phone}
                          </Typography>
                        </CardContent>
                      </Card>
                    </FloatingCard>
                  </Grid>
                )}
                {siteSettings?.contact_whatsapp && (
                  <Grid item xs={12} md={4}>
                    <FloatingCard delay={0.2}>
                      <Card
                        sx={{
                          textAlign: 'center',
                          p: 4,
                          borderRadius: 4,
                          background: alpha('#fff', 0.03),
                          border: `1px solid ${alpha('#667eea', 0.2)}`,
                          backdropFilter: 'blur(20px)',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)', borderColor: '#667eea' },
                        }}
                      >
                        <CardContent>
                          <WhatsAppIcon sx={{ fontSize: 50, color: '#25D366', mb: 2 }} />
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: 'white' }}>
                            WhatsApp
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#25D366', fontWeight: 500 }}>
                            {siteSettings.contact_whatsapp}
                          </Typography>
                        </CardContent>
                      </Card>
                    </FloatingCard>
                  </Grid>
                )}
              </Grid>
            </Container>
          </Box>
        ) : null}
      </Box>
      <Footer />
    </Box>
  )
}

export default Home
