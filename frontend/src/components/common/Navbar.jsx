import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import TranslateIcon from '@mui/icons-material/Translate'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useSiteStore } from '../../store/useSiteStore'
import { useEffect } from 'react'

const navItems = [
  { labelKey: 'nav.home', to: '/' },
  { labelKey: 'nav.dashboard', to: '/dashboard' },
  { labelKey: 'nav.aiChat', to: '/ai-chat' },
  { labelKey: 'nav.profile', to: '/profile' },
  { labelKey: 'nav.themes', to: '/themes' },
  { labelKey: 'nav.admin', to: '/admin-panel' },
]

const languageOptions = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JA' },
]

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const mode = useAppStore((state) => state.mode)
  const setMode = useAppStore((state) => state.setMode)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const siteSettings = useSiteStore((state) => state.settings)
  const loadSettings = useSiteStore((state) => state.loadSettings)
  const location = useLocation()

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark'
    document.body.setAttribute('data-theme', next)
    setMode(next)
  }

  const setLanguage = (code) => {
    i18n.changeLanguage(code)
  }

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar sx={{ py: 1.5, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {siteSettings?.logo ? (
            <img src={siteSettings.logo} alt="logo" style={{ height: 32 }} />
          ) : (
            <TranslateIcon color="primary" />
          )}
          <Typography variant="h6" fontWeight={700}>
            {siteSettings?.site_name || 'EroxAI'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
          {navItems
            .filter((item) => (item.to === '/admin-panel' ? user?.is_staff : true))
            .map((item) => (
              <Button
                key={item.to}
                component={RouterLink}
                to={item.to}
                color={location.pathname === item.to ? 'primary' : 'inherit'}
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  display: { xs: item.to === '/themes' ? 'none' : 'flex' }
                }}
              >
                {t(item.labelKey)}
              </Button>
            ))}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 1 }}>
            {languageOptions.map((option) => (
              <Button
                key={option.code}
                size="small"
                variant={i18n.language === option.code ? 'contained' : 'text'}
                onClick={() => setLanguage(option.code)}
              >
                {option.label}
              </Button>
            ))}
          </Box>
          {isAuthenticated ? (
            <Button variant="outlined" onClick={logout}>
              Çıkış
            </Button>
          ) : (
            <Button component={RouterLink} to="/login" variant="outlined">
              Giriş
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
