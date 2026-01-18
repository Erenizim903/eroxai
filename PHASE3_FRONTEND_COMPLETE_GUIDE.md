# 🎨 Phase 3: Complete Frontend Implementation Guide

## 📦 Proje Yapısı Özeti

Frontend projesi için **100+ dosya** oluşturulması gerekiyor. Bu rehber, tüm dosyaların içeriğini ve yapısını detaylı olarak açıklar.

---

## 🚀 Hızlı Başlangıç

### 1. Kurulum
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 2. Geliştirme
```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 📁 Dosya Yapısı ve İçerikleri

### ✅ Oluşturulmuş Dosyalar
1. ✅ `package.json` - Dependencies
2. ✅ `vite.config.js` - Vite configuration
3. ✅ `.env.example` - Environment variables
4. ✅ `index.html` - HTML template

### 📝 Oluşturulacak Dosyalar (Öncelik Sırasına Göre)

---

## 🎯 TIER 1: Core Files (Kritik - İlk Öncelik)

### 1. src/main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import App from './App'
import './i18n/config'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <App />
        </SnackbarProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

### 2. src/App.jsx
```jsx
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Routes, Route, Navigate } from 'react-router-dom'
import theme from './theme/theme'
import ProtectedRoute from './components/common/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
```

### 3. src/index.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', 'Noto Sans JP', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

## 🎨 TIER 2: Theme & Config

### 4. src/theme/theme.js
```javascript
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#f50057',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Noto Sans JP', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
})

export default theme
```

### 5. src/i18n/config.js
```javascript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation files
import jaTranslation from '../../public/locales/ja/translation.json'
import enTranslation from '../../public/locales/en/translation.json'
import trTranslation from '../../public/locales/tr/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: jaTranslation },
      en: { translation: enTranslation },
      tr: { translation: trTranslation },
    },
    fallbackLng: 'ja',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
```

---

## 🔐 TIER 3: Services & Store

### 6. src/services/api.js
```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
```

### 7. src/services/authService.js
```javascript
import api from './api'

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials)
    const { access, refresh, user } = response.data
    
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(user))
    
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  },
}
```

### 8. src/services/ocrService.js
```javascript
import api from './api'

export const ocrService = {
  uploadFile: async (file, language = null) => {
    const formData = new FormData()
    formData.append('file', file)
    if (language) formData.append('language', language)

    const response = await api.post('/ocr/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  processPhoto: async (photo) => {
    const formData = new FormData()
    formData.append('photo', photo)

    const response = await api.post('/ocr/process-photo/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  ocrAndTranslate: async (file, targetLanguage = 'ja') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('target_language', targetLanguage)

    const response = await api.post('/ocr/ocr-and-translate/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  getResult: async (id) => {
    const response = await api.get(`/ocr/${id}/`)
    return response.data
  },

  detectFields: async (id) => {
    const response = await api.get(`/ocr/${id}/detect-fields/`)
    return response.data
  },
}
```

### 9. src/services/translationService.js
```javascript
import api from './api'

export const translationService = {
  translate: async (text, targetLang, sourceLang = 'auto', useTerminology = true) => {
    const response = await api.post('/translation/translate/', {
      text,
      target_lang: targetLang,
      source_lang: sourceLang,
      use_terminology: useTerminology,
    })
    return response.data
  },

  batchTranslate: async (texts, targetLang, sourceLang = 'auto') => {
    const response = await api.post('/translation/batch-translate/', {
      texts,
      target_lang: targetLang,
      source_lang: sourceLang,
    })
    return response.data
  },

  getTerminology: async (targetLang = null, category = null) => {
    const params = {}
    if (targetLang) params.target_lang = targetLang
    if (category) params.category = category

    const response = await api.get('/translation/terminology/', { params })
    return response.data
  },

  addTerminology: async (term) => {
    const response = await api.post('/translation/terminology/', term)
    return response.data
  },

  importTerms: async (terms, targetLang, category) => {
    const response = await api.post('/translation/terminology/import-terms/', {
      terms,
      target_lang: targetLang,
      category,
    })
    return response.data
  },
}
```

### 10. src/store/authStore.js
```javascript
import { create } from 'zustand'
import { authService } from '../services/authService'

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  
  login: async (credentials) => {
    const data = await authService.login(credentials)
    set({ user: data.user, isAuthenticated: true })
    return data
  },
  
  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },
  
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))
```

---

## 📄 TIER 4: Pages

### 11. src/pages/Landing.jsx
```jsx
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import TranslateIcon from '@mui/icons-material/Translate'
import SpeedIcon from '@mui/icons-material/Speed'

function Landing() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const features = [
    {
      icon: <UploadFileIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: t('landing.features.ocr.title'),
      description: t('landing.features.ocr.description'),
    },
    {
      icon: <TranslateIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: t('landing.features.translation.title'),
      description: t('landing.features.translation.description'),
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: t('landing.features.fast.title'),
      description: t('landing.features.fast.description'),
    },
  ]

  return (
    <Box>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            {t('landing.hero.title')}
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            {t('landing.hero.subtitle')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              {t('common.getStarted')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.100' } }}
            >
              {t('common.register')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          {t('landing.features.title')}
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          {t('landing.features.subtitle')}
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {t('landing.cta.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            {t('landing.cta.subtitle')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            {t('common.startNow')}
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default Landing
```

---

## 🎯 Kalan Dosyalar (Özet)

Toplam **100+ dosya** oluşturulması gerekiyor. Yukarıda en kritik 11 dosya detaylı olarak verildi.

### Kalan Dosya Kategorileri:

**Components (30+ dosya):**
- common/ (Navbar, Footer, LoadingSpinner, ErrorBoundary, ProtectedRoute, LanguageSelector)
- admin/ (Dashboard, DocumentUpload, FieldSelector, APIKeyManager, TerminologyManager, Analytics)
- user/ (FileUpload, OCRResult, TranslationView, LivePreview, DocumentDownload)

**Pages (6 dosya):**
- Login.jsx
- Register.jsx
- UserDashboard.jsx
- AdminDashboard.jsx
- NotFound.jsx

**Hooks (5 dosya):**
- useAuth.js
- useOCR.js
- useTranslation.js
- useDebounce.js
- useLocalStorage.js

**Utils (5 dosya):**
- constants.js
- helpers.js
- validators.js
- formatters.js
- fileUtils.js

**Locales (3 dosya):**
- public/locales/ja/translation.json
- public/locales/en/translation.json
- public/locales/tr/translation.json

**Store (3 dosya):**
- ocrStore.js
- translationStore.js
- uiStore.js

**Services (2 dosya):**
- adminService.js
- documentService.js

---

## 🚀 Sonraki Adımlar

1. **Manuel Oluşturma:** Yukarıdaki dosyaları tek tek oluşturun
2. **Otomatik Script:** Veya bir script ile toplu oluşturun
3. **Test:** `npm run dev` ile test edin
4. **Deploy:** Production build alın

---

## 📝 Önemli Notlar

1. **Translation Files:** JSON dosyalarını oluşturun (JA, EN, TR)
2. **Environment:** `.env` dosyasını `.env.example`'dan kopyalayın
3. **API URL:** Backend URL'ini doğru ayarlayın
4. **Dependencies:** `npm install` çalıştırın

---

**Tüm dosyaların detaylı içeriği için lütfen belirtin, hangi dosyaları öncelikli olarak oluşturmamı istersiniz?**
