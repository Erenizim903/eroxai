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
  useMediaQuery,
} from '@mui/material'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import BoltIcon from '@mui/icons-material/Bolt'
import LanguageIcon from '@mui/icons-material/Language'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
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
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
              <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={10} lg={8}>
                  <Stack spacing={4} alignItems="center" textAlign="center">
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
                          fontSize: { xs: '0.75rem', md: '0.9rem' },
                          px: 2,
                          py: { xs: 1.5, md: 2.5 },
                        }}
                      />
                      <TypewriterText
                        text={siteSettings?.hero_title || t('home.hero.title')}
                        variant="h1"
                        speed={30}
                        sx={{
                          fontSize: { xs: '2rem', sm: '3rem', md: '4.5rem', lg: '5.5rem' },
                          fontWeight: 900,
                          lineHeight: 1.1,
                          mb: 3,
                          textAlign: 'center',
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
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                          textAlign: 'center',
                        }}
                      >
                        {siteSettings?.hero_subtitle || t('home.hero.subtitle')}
                      </AnimatedText>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            component={RouterLink}
                            to="/dashboard"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            fullWidth={isMobile}
                            sx={{
                              px: { xs: 3, md: 5 },
                              py: { xs: 1.5, md: 1.8 },
                              borderRadius: 3,
                              fontSize: { xs: '0.95rem', md: '1.1rem' },
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
                            fullWidth={isMobile}
                            sx={{
                              px: { xs: 3, md: 5 },
                              py: { xs: 1.5, md: 1.8 },
                              borderRadius: 3,
                              fontSize: { xs: '0.95rem', md: '1.1rem' },
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
                      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2} sx={{ mb: 3, justifyContent: 'center' }}>
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
                                fontSize: { xs: '0.7rem', md: '0.875rem' },
                              }}
                            />
                          </motion.div>
                        ))}
                      </Stack>
                      {socialLinks.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <AnimatedText
                            variant="body2"
                            delay={0.6}
                            sx={{
                              color: alpha('#fff', 0.6),
                              mb: 2,
                              textAlign: 'center',
                              fontSize: { xs: '0.7rem', md: '0.875rem' },
                            }}
                          >
                            {i18n.language === 'tr' ? 'Bizi Takip Edin' : i18n.language === 'ja' ? 'フォローしてください' : 'Follow Us'}
                          </AnimatedText>
                          <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" gap={1.5} sx={{ mt: 1 }}>
                            {socialLinks.map((link, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + idx * 0.1, type: 'spring', stiffness: 200 }}
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <IconButton
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    width: { xs: 40, md: 48 },
                                    height: { xs: 40, md: 48 },
                                    borderRadius: '50%',
                                    background: alpha(link.color || '#667eea', 0.15),
                                    border: `2px solid ${alpha(link.color || '#667eea', 0.3)}`,
                                    color: link.color || '#667eea',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      background: alpha(link.color || '#667eea', 0.25),
                                      borderColor: link.color || '#667eea',
                                      boxShadow: `0 8px 20px ${alpha(link.color || '#667eea', 0.4)}`,
                                    },
                                  }}
                                >
                                  {link.icon}
                                </IconButton>
                              </motion.div>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </motion.div>
                  </Stack>
                </Grid>
              </Grid>
            </Container>
          </motion.div>
        </Box>

        <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
          <Container maxWidth="lg">
            <SectionTitle
              kicker={i18n.language === 'tr' ? 'Kullanım Alanları' : i18n.language === 'ja' ? '活用シーン' : 'Use Cases'}
              title={i18n.language === 'tr' ? 'Günlük İşlerde Nasıl Kullanılır?' : i18n.language === 'ja' ? '日常業務での使い方' : 'How You Can Use It'}
              subtitle={
                i18n.language === 'tr'
                  ? 'Belge hazırlama, kontrol ve çıktı süreçlerini tek panelde tamamlayın.'
                  : i18n.language === 'ja'
                  ? '書類作成・確認・出力をワンパネルで完結。'
                  : 'Complete document creation, review, and export in one panel.'
              }
            />
            <Grid container spacing={4}>
              {[
                {
                  icon: <BuildIcon />,
                  title: i18n.language === 'tr' ? 'Şantiye ve İnşaat' : i18n.language === 'ja' ? '建設・現場' : 'Construction',
                  desc:
                    i18n.language === 'tr'
                      ? 'Günlük formlar, teslim tutanakları ve denetim belgelerini hızlıca hazırlayın.'
                      : i18n.language === 'ja'
                      ? '日報・受領書・点検書類を素早く作成。'
                      : 'Prepare daily forms, delivery logs, and inspection documents quickly.',
                },
                {
                  icon: <InfoIcon />,
                  title: i18n.language === 'tr' ? 'Yasal Evraklar' : i18n.language === 'ja' ? '法的書類' : 'Legal Documents',
                  desc:
                    i18n.language === 'tr'
                      ? 'Sözleşme, beyan ve izin süreçlerinde şablonları standartlaştırın.'
                      : i18n.language === 'ja'
                      ? '契約書・申請書のテンプレートを標準化。'
                      : 'Standardize contracts, declarations, and permits with templates.',
                },
                {
                  icon: <SecurityIcon />,
                  title: i18n.language === 'tr' ? 'Atık ve Çevre' : i18n.language === 'ja' ? '廃棄物・環境' : 'Waste & Compliance',
                  desc:
                    i18n.language === 'tr'
                      ? 'Zehirli atık bildirimleri ve çevre raporlarını tek yerden yönetin.'
                      : i18n.language === 'ja'
                      ? '有害廃棄物の報告書や環境レポートを一元管理。'
                      : 'Manage hazardous waste reports and compliance documents centrally.',
                },
                {
                  icon: <TrendingUpIcon />,
                  title: i18n.language === 'tr' ? 'Operasyon & Raporlama' : i18n.language === 'ja' ? '運用・レポート' : 'Operations',
                  desc:
                    i18n.language === 'tr'
                      ? 'OCR + otomatik çeviri ile süreçleri hızlandırın, hata riskini azaltın.'
                      : i18n.language === 'ja'
                      ? 'OCRと自動翻訳でスピードを上げ、ミスを削減。'
                      : 'Speed up workflows with OCR + translation and reduce errors.',
                },
              ].map((card, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <FloatingCard delay={idx * 0.1}>
                    <Card
                      sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        background: alpha('#fff', 0.03),
                        border: `1px solid ${alpha('#667eea', 0.2)}`,
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: alpha('#667eea', 0.2),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                              }}
                            >
                              {card.icon}
                            </Box>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                              {card.title}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                            {card.desc}
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

        <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Chip label="Hızlı Erişim" sx={{ mb: 2, background: alpha('#667eea', 0.2), color: '#fff' }} />
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                  {i18n.language === 'tr' ? 'Sayfa Sayfa İlerleyin' : i18n.language === 'ja' ? 'ページごとに進む' : 'Move Page by Page'}
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), maxWidth: 700, mx: 'auto' }}>
                  {i18n.language === 'tr'
                    ? 'Tüm içerikler ayrı sayfalara ayrıldı. Şablonları keşfedin, süreci öğrenin, çalışma alanına geçin.'
                    : i18n.language === 'ja'
                    ? 'すべてのコンテンツはページごとに分割されました。テンプレートを確認し、プロセスを学び、作業スペースへ進みます。'
                    : 'All content is separated into pages. Explore templates, learn the process, and jump into the workspace.'}
                </Typography>
              </Box>
            </motion.div>
            <Grid container spacing={4}>
              {[
                {
                  title: i18n.language === 'tr' ? 'Şablon Kütüphanesi' : i18n.language === 'ja' ? 'テンプレートライブラリ' : 'Template Library',
                  desc:
                    i18n.language === 'tr'
                      ? 'Japonya yıkım & inşaat evraklarına özel XLSX şablonları.'
                      : i18n.language === 'ja'
                      ? '日本の解体・建設書類に特化したXLSXテンプレート。'
                      : 'XLSX templates tailored for Japan demolition & construction documents.',
                  to: '/templates',
                },
                {
                  title: i18n.language === 'tr' ? 'Süreç & Akış' : i18n.language === 'ja' ? 'プロセス' : 'Workflow',
                  desc:
                    i18n.language === 'tr'
                      ? 'Yükleme, doldurma, Japoncaya dönüştürme ve indirme adımları.'
                      : i18n.language === 'ja'
                      ? 'アップロード、入力、日本語変換、ダウンロードの流れ。'
                      : 'Upload, fill, translate to Japanese, and download steps.',
                  to: '/workflow',
                },
              ].map((item, idx) => (
                <Grid key={item.to} item xs={12} md={6}>
                  <FloatingCard delay={idx * 0.2}>
                    <Card
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        background: alpha('#fff', 0.03),
                        border: `1px solid ${alpha('#667eea', 0.2)}`,
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), lineHeight: 1.8 }}>
                            {item.desc}
                          </Typography>
                          <Button
                            component={RouterLink}
                            to={item.to}
                            variant="contained"
                            sx={{ alignSelf: 'flex-start', mt: 1 }}
                          >
                            {i18n.language === 'tr' ? 'Sayfaya Git' : i18n.language === 'ja' ? 'ページを見る' : 'Open Page'}
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </FloatingCard>
                </Grid>
              ))}
            </Grid>
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
