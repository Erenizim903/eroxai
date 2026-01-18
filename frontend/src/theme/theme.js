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

export const getTheme = (mode = 'dark') => {
  const theme = createTheme({
    palette: {
      mode,
      ...basePalette,
      background: {
        default: mode === 'dark' ? '#0B1120' : '#F7F8FC',
        paper: mode === 'dark' ? '#111827' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#F9FAFB' : '#111827',
        secondary: mode === 'dark' ? '#9CA3AF' : '#4B5563',
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
