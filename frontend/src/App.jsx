import { useEffect, useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { getTheme } from './theme/theme'
import Home from './pages/Home'
import Workspace from './pages/Workspace'
import NotFound from './pages/NotFound'
import { useAppStore } from './store/useAppStore'

function App() {
  const mode = useAppStore((state) => state.mode)
  const theme = useMemo(() => getTheme(mode), [mode])

  useEffect(() => {
    document.body.setAttribute('data-theme', mode)
  }, [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
