import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import BoltIcon from '@mui/icons-material/Bolt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import LanguageIcon from '@mui/icons-material/Language'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AnimatedBackground from '../components/common/AnimatedBackground'
import SectionTitle from '../components/common/SectionTitle'

const featureCards = [
  {
    icon: <AutoAwesomeIcon color="primary" />,
    titleKey: 'home.features.ocr.title',
    descKey: 'home.features.ocr.desc',
  },
  {
    icon: <LanguageIcon color="primary" />,
    titleKey: 'home.features.translate.title',
    descKey: 'home.features.translate.desc',
  },
  {
    icon: <BoltIcon color="primary" />,
    titleKey: 'home.features.fast.title',
    descKey: 'home.features.fast.desc',
  },
]

const Home = () => {
  const { t } = useTranslation()

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="h2">{t('home.hero.title')}</Typography>
                <Typography variant="h5" color="text.secondary">
                  {t('home.hero.subtitle')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/workspace"
                    variant="contained"
                    size="large"
                  >
                    {t('home.hero.ctaPrimary')}
                  </Button>
                  <Button variant="outlined" size="large">
                    {t('home.hero.ctaSecondary')}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card sx={{ p: 2, backdropFilter: 'blur(12px)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('home.hero.demo')}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 2 }}>
                      {t('home.hero.demoTitle')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      {t('home.hero.demoDesc')}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ mt: 10 }}>
            <SectionTitle
              kicker={t('home.features.kicker')}
              title={t('home.features.title')}
              subtitle={t('home.features.subtitle')}
            />
            <Grid container spacing={3}>
              {featureCards.map((feature) => (
                <Grid key={feature.titleKey} item xs={12} md={4}>
                  <motion.div whileHover={{ y: -8 }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack spacing={2}>
                          {feature.icon}
                          <Typography variant="h6">{t(feature.titleKey)}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t(feature.descKey)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mt: 10 }}>
            <SectionTitle
              kicker={t('home.steps.kicker')}
              title={t('home.steps.title')}
              subtitle={t('home.steps.subtitle')}
            />
            <Grid container spacing={3}>
              {[1, 2, 3].map((step) => (
                <Grid key={step} item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="overline" color="primary">
                        {t(`home.steps.step${step}.label`)}
                      </Typography>
                      <Typography variant="h6">{t(`home.steps.step${step}.title`)}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(`home.steps.step${step}.desc`)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
        <Footer />
      </Box>
    </Box>
  )
}

export default Home
