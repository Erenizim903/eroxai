import { Box, Card, CardContent, Chip, Container, Grid, Stack, Typography, alpha, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import TypewriterText from '../components/common/TypewriterText'
import { useSiteStore } from '../store/useSiteStore'

const FloatingCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
)

const Workflow = () => {
  const { i18n } = useTranslation()
  const siteSettings = useSiteStore((state) => state.settings)
  const loadSettings = useSiteStore((state) => state.loadSettings)

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const customSteps = useMemo(() => {
    const steps = siteSettings?.site_texts?.workflow_steps
    return Array.isArray(steps) ? steps : null
  }, [siteSettings])

  const steps = customSteps || [
    {
      title: i18n.language === 'tr' ? '1. Şablon Seçimi' : i18n.language === 'ja' ? '1. テンプレート選択' : '1. Choose Template',
      desc:
        i18n.language === 'tr'
          ? 'Yıkım ve inşaat evraklarına uygun XLSX şablonları listeleyin.'
          : i18n.language === 'ja'
          ? '解体・建設書類向けのXLSXテンプレートを選択。'
          : 'Select XLSX templates for demolition and construction documents.',
    },
    {
      title: i18n.language === 'tr' ? '2. Alanları Doldurma' : i18n.language === 'ja' ? '2. フィールド入力' : '2. Fill Fields',
      desc:
        i18n.language === 'tr'
          ? 'Kendi dilinizde alanları doldurun, sistem alanları eşler.'
          : i18n.language === 'ja'
          ? '自分の言語で入力し、システムが項目を対応付けます。'
          : 'Fill fields in your language, the system maps fields automatically.',
    },
    {
      title: i18n.language === 'tr' ? '3. Japonca Çıktı' : i18n.language === 'ja' ? '3. 日本語出力' : '3. Japanese Output',
      desc:
        i18n.language === 'tr'
          ? 'Çıktı aynı formatta Japonca olarak hazırlanır.'
          : i18n.language === 'ja'
          ? '同じ形式で日本語の出力が生成されます。'
          : 'Output is generated in Japanese with the same layout.',
    },
    {
      title: i18n.language === 'tr' ? '4. İndir & Paylaş' : i18n.language === 'ja' ? '4. ダウンロード' : '4. Download',
      desc:
        i18n.language === 'tr'
          ? 'Belgeyi indirip ilgili kurumlarla paylaşın.'
          : i18n.language === 'ja'
          ? '書類をダウンロードして提出します。'
          : 'Download and submit the document.',
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <TypewriterText
            text={
              siteSettings?.site_texts?.workflow_title ||
              (i18n.language === 'tr' ? 'Çalışma Akışı' : i18n.language === 'ja' ? 'ワークフロー' : 'Workflow')
            }
            variant="h3"
            speed={50}
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          />
          <Typography variant="body1" sx={{ color: alpha('#fff', 0.75), maxWidth: 760, mx: 'auto', lineHeight: 1.9 }}>
            {siteSettings?.site_texts?.workflow_subtitle ||
              (i18n.language === 'tr'
                ? 'Belgeleri aynı formatta Japoncaya dönüştürmek için adım adım akış.'
                : i18n.language === 'ja'
                ? '同じフォーマットで日本語へ変換するためのステップ。'
                : 'Step-by-step flow to convert documents into Japanese format.')}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3, flexWrap: 'wrap' }}>
            <Chip
              label={`${steps.length} ${i18n.language === 'tr' ? 'Adım' : i18n.language === 'ja' ? 'ステップ' : 'Steps'}`}
              sx={{ background: alpha('#667eea', 0.25), color: '#fff', fontWeight: 600 }}
            />
            <Chip
              label={i18n.language === 'tr' ? 'Otomatik Eşleme' : i18n.language === 'ja' ? '自動マッピング' : 'Auto Mapping'}
              sx={{ background: alpha('#10B981', 0.2), color: '#10B981', fontWeight: 600 }}
            />
          </Stack>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, idx) => (
            <Grid key={step.title} item xs={12} md={6}>
              <FloatingCard delay={idx * 0.15}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: alpha('#fff', 0.03),
                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                    backdropFilter: 'blur(20px)',
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 20px 40px ${alpha('#667eea', 0.25)}`,
                      borderColor: '#667eea',
                      background: alpha('#667eea', 0.08),
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Chip
                        label={`${i18n.language === 'tr' ? 'Adım' : i18n.language === 'ja' ? 'ステップ' : 'Step'} ${idx + 1}`}
                        sx={{ alignSelf: 'flex-start', background: alpha('#667eea', 0.2), color: '#fff' }}
                      />
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

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
              px: 4,
              py: 1.5,
            }}
          >
            {i18n.language === 'tr' ? 'Çalışma Alanına Git' : i18n.language === 'ja' ? '作業スペースへ' : 'Go to Workspace'}
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

export default Workflow
