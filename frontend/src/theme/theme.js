import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const basePalette = {
  primary: {
    main: '#5B8CFF',
    light: '#8FB3FF',
    dark: '#2F5BEA',
  },
  secondary: {
    main: '#FF8F5B',
    light: '#FFB18B',
    dark: '#E65F2A',
  },
  success: {
    main: '#30C48D',
  },
  warning: {
    main: '#FFB020',
  },
  error: {
    main: '#F04438',
  },
}

const baseTypography = {
  fontFamily: ['Roboto', 'Noto Sans JP', 'system-ui', 'sans-serif'].join(','),
  h1: {
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontWeight: 700,
  },
  h3: {
    fontWeight: 600,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
}

const presetPalettes = {
  ocean: { primary: '#5B8CFF', secondary: '#30C48D' },
  sunset: { primary: '#FF8F5B', secondary: '#F04438' },
  violet: { primary: '#8B5CF6', secondary: '#EC4899' },
  emerald: { primary: '#10B981', secondary: '#06B6D4' },
}

const normalizeMode = (value) => (value === 'light' || value === 'dark' ? value : 'dark')
const normalizePreset = (value) => (typeof value === 'string' && value.length ? value : 'ocean')
const normalizeColor = (value) => (typeof value === 'string' && value.length ? value : null)

export const getTheme = (mode = 'dark', preset = 'ocean', primaryColor = null, secondaryColor = null) => {
  const safeMode = normalizeMode(mode)
  const safePreset = normalizePreset(preset)
  const safePrimary = normalizeColor(primaryColor)
  const safeSecondary = normalizeColor(secondaryColor)

  let colors
  if (safePrimary && safeSecondary) {
    colors = { primary: safePrimary, secondary: safeSecondary }
  } else {
    colors = presetPalettes[safePreset] || presetPalettes.ocean
  }
  const theme = createTheme({
    palette: {
      mode: safeMode,
      ...basePalette,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      background: {
        default: safeMode === 'dark' ? '#0B1120' : '#F7F8FC',
        paper: safeMode === 'dark' ? '#111827' : '#FFFFFF',
      },
      text: {
        primary: safeMode === 'dark' ? '#F9FAFB' : '#111827',
        secondary: safeMode === 'dark' ? '#9CA3AF' : '#4B5563',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: baseTypography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  })

  return responsiveFontSizes(theme)
}
