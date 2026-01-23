import { useEffect } from 'react'
import { Box, Card, CardContent, Container, Grid, Tab, Tabs, Typography, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import UploadPanel from '../components/user/UploadPanel'
import OcrPanel from '../components/user/OcrPanel'
import TranslatePanel from '../components/user/TranslatePanel'
import HistoryPanel from '../components/user/HistoryPanel'
import SettingsPanel from '../components/user/SettingsPanel'
import { useAppStore } from '../store/useAppStore'

const tabKeys = ['ocr', 'translate', 'history', 'settings']

const Workspace = () => {
  const { t } = useTranslation()
  const mode = useAppStore((state) => state.mode)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'ocr'
  const safeTab = tabKeys.includes(activeTab) ? activeTab : 'ocr'

  useEffect(() => {
    document.body.setAttribute('data-theme', mode)
  }, [mode])

  const handleTabChange = (_event, value) => {
    setSearchParams({ tab: value })
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 800, color: 'white' }}>
            {t('workspace.title')}
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#fff', 0.7) }}>
            {t('workspace.subtitle')}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <UploadPanel />
          </Grid>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 4,
                background: alpha('#fff', 0.03),
                border: `1px solid ${alpha('#667eea', 0.2)}`,
                backdropFilter: 'blur(20px)',
              }}
            >
              <CardContent>
                <Tabs
                  value={safeTab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      color: alpha('#fff', 0.7),
                      fontWeight: 600,
                      '&.Mui-selected': { color: '#667eea' },
                    },
                    '& .MuiTabs-indicator': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    },
                  }}
                >
                  {tabKeys.map((tab) => (
                    <Tab key={tab} label={t(`workspace.tabs.${tab}`)} value={tab} />
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            <Box>
              {safeTab === 'ocr' && <OcrPanel />}
              {safeTab === 'translate' && <TranslatePanel />}
              {safeTab === 'history' && <HistoryPanel />}
              {safeTab === 'settings' && <SettingsPanel />}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}

export default Workspace
