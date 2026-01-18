import { useEffect, useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { getTheme } from './theme/theme'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { useAppStore } from './store/useAppStore'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import { useAuthStore } from './store/useAuthStore'
import Profile from './pages/Profile'
import Themes from './pages/Themes'
import AIChat from './pages/AIChat'
import ChatBot from './components/common/ChatBot'
import { useSiteStore } from './store/useSiteStore'

function App() {
  const mode = useAppStore((state) => state.mode)
  const siteSettings = useSiteStore((state) => state.settings)
  const themePreset = siteSettings?.theme_preset || useAppStore((state) => state.themePreset)
  const primaryColor = siteSettings?.theme_primary_color || '#667eea'
  const secondaryColor = siteSettings?.theme_secondary_color || '#764ba2'
  const theme = useMemo(() => getTheme(mode, themePreset, primaryColor, secondaryColor), [mode, themePreset, primaryColor, secondaryColor])
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const loadMe = useAuthStore((state) => state.loadMe)

  useEffect(() => {
    document.body.setAttribute('data-theme', mode)
  }, [mode])

  useEffect(() => {
    if (isAuthenticated && !user) {
      loadMe()
    }
  }, [isAuthenticated, user, loadMe])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/themes"
          element={
            <ProtectedRoute requireAdmin>
              <Themes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <ChatBot />
    </ThemeProvider>
  )
}

export default App
