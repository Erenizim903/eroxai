import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import TranslateIcon from '@mui/icons-material/Translate'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'

const navItems = [
  { labelKey: 'nav.home', to: '/' },
  { labelKey: 'nav.workspace', to: '/workspace' },
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
  const location = useLocation()

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark'
    document.body.setAttribute('data-theme', next)
    setMode(next)
  }

  const setLanguage = (code) => {
    i18n.changeLanguage(code)
  }

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar sx={{ py: 1.5, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <TranslateIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            EroxAI Studio
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={RouterLink}
              to={item.to}
              color={location.pathname === item.to ? 'primary' : 'inherit'}
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
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
