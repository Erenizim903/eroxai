import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import TranslateIcon from '@mui/icons-material/Translate'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useSiteStore } from '../../store/useSiteStore'
import { useEffect, useState } from 'react'

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
  const [mobileOpen, setMobileOpen] = useState(false)

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box sx={{ width: 280, background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)', height: '100%', p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {siteSettings?.logo ? (
            <img src={siteSettings.logo} alt="logo" style={{ height: 32 }} />
          ) : (
            <TranslateIcon color="primary" />
          )}
          <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
            {siteSettings?.site_name || 'EroxAI'}
          </Typography>
        </Stack>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
      <List>
        {navItems
          .filter((item) => (item.to === '/admin-panel' ? user?.is_staff : true))
          .map((item) => (
            <ListItem key={item.to} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.to}
                onClick={handleDrawerToggle}
                selected={location.pathname === item.to}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.1)',
                  },
                }}
              >
                <ListItemText primary={t(item.labelKey)} sx={{ color: 'white' }} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
      <Stack spacing={1} sx={{ px: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
          Dil / Language
        </Typography>
        <Stack direction="row" spacing={1}>
          {languageOptions.map((option) => (
            <Button
              key={option.code}
              size="small"
              variant={i18n.language === option.code ? 'contained' : 'outlined'}
              onClick={() => {
                setLanguage(option.code)
                handleDrawerToggle()
              }}
              sx={{
                flex: 1,
                minWidth: 0,
                borderColor: 'rgba(255,255,255,0.2)',
                color: i18n.language === option.code ? 'white' : 'rgba(255,255,255,0.7)',
              }}
            >
              {option.label}
            </Button>
          ))}
        </Stack>
      </Stack>
      <Box sx={{ mt: 'auto', pt: 3, px: 2 }}>
        {isAuthenticated ? (
          <Button variant="outlined" fullWidth onClick={logout} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
            Çıkış
          </Button>
        ) : (
          <Button component={RouterLink} to="/login" variant="outlined" fullWidth onClick={handleDrawerToggle} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
            Giriş
          </Button>
        )}
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(20px)' }}>
        <Toolbar sx={{ py: 1.5, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {siteSettings?.logo ? (
              <img src={siteSettings.logo} alt="logo" style={{ height: 32 }} />
            ) : (
              <TranslateIcon color="primary" />
            )}
            <Typography variant="h6" fontWeight={700} sx={{ display: { xs: 'none', sm: 'block' } }}>
              {siteSettings?.site_name || 'EroxAI'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems
                .filter((item) => (item.to === '/admin-panel' ? user?.is_staff : true))
                .map((item) => (
                  <Button
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    color={location.pathname === item.to ? 'primary' : 'inherit'}
                    sx={{ fontSize: '0.875rem', px: 2 }}
                  >
                    {t(item.labelKey)}
                  </Button>
                ))}
            </Box>
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
              <Button variant="outlined" onClick={logout} sx={{ display: { xs: 'none', md: 'flex' } }}>
                Çıkış
              </Button>
            ) : (
              <Button component={RouterLink} to="/login" variant="outlined" sx={{ display: { xs: 'none', md: 'flex' } }}>
                Giriş
              </Button>
            )}
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navbar
