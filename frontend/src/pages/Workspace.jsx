import { useEffect } from 'react'
import { Box, Container, Grid, Tab, Tabs, Typography } from '@mui/material'
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
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {t('workspace.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('workspace.subtitle')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <UploadPanel />
          </Grid>
          <Grid item xs={12} md={8}>
            <Tabs value={safeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              {tabKeys.map((tab) => (
                <Tab key={tab} label={t(`workspace.tabs.${tab}`)} value={tab} />
              ))}
            </Tabs>
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
