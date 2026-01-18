#!/bin/bash

# Frontend Dosya Oluşturma Script'i
# Bu script tüm frontend dosyalarını otomatik olarak oluşturur

echo "🚀 Frontend dosyaları oluşturuluyor..."

# Dizinleri oluştur
mkdir -p src/{components/{common,admin,user},pages,services,store,hooks,utils,i18n,theme}
mkdir -p public/locales/{ja,en,tr}

echo "✅ Dizinler oluşturuldu"

# Core Files
cat > src/main.jsx << 'EOF'
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
EOF

cat > src/App.jsx << 'EOF'
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
EOF

cat > src/index.css << 'EOF'
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
EOF

echo "✅ Core dosyalar oluşturuldu"

# Translation files
cat > public/locales/ja/translation.json << 'EOF'
{
  "common": {
    "login": "ログイン",
    "logout": "ログアウト",
    "register": "登録",
    "upload": "アップロード",
    "download": "ダウンロード",
    "translate": "翻訳",
    "save": "保存",
    "cancel": "キャンセル",
    "delete": "削除",
    "edit": "編集",
    "search": "検索",
    "getStarted": "始める",
    "startNow": "今すぐ始める"
  },
  "landing": {
    "hero": {
      "title": "ドキュメント翻訳システム",
      "subtitle": "OCRと自動翻訳で文書処理を簡単に"
    },
    "features": {
      "title": "主な機能",
      "subtitle": "強力なツールで文書処理を効率化",
      "ocr": {
        "title": "OCR処理",
        "description": "画像やPDFからテキストを抽出"
      },
      "translation": {
        "title": "自動翻訳",
        "description": "日本語、英語、トルコ語に対応"
      },
      "fast": {
        "title": "高速処理",
        "description": "数秒で文書を処理"
      }
    },
    "cta": {
      "title": "今すぐ始めましょう",
      "subtitle": "無料でアカウントを作成"
    }
  },
  "user": {
    "dashboard": "ダッシュボード",
    "uploadFile": "ファイルをアップロード",
    "myDocuments": "マイドキュメント",
    "history": "履歴"
  },
  "admin": {
    "dashboard": "管理ダッシュボード",
    "manageKeys": "APIキー管理",
    "terminology": "用語辞書",
    "analytics": "分析",
    "users": "ユーザー"
  }
}
EOF

cat > public/locales/en/translation.json << 'EOF'
{
  "common": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register",
    "upload": "Upload",
    "download": "Download",
    "translate": "Translate",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "getStarted": "Get Started",
    "startNow": "Start Now"
  },
  "landing": {
    "hero": {
      "title": "Document Translation System",
      "subtitle": "Simplify document processing with OCR and automatic translation"
    },
    "features": {
      "title": "Key Features",
      "subtitle": "Streamline document processing with powerful tools",
      "ocr": {
        "title": "OCR Processing",
        "description": "Extract text from images and PDFs"
      },
      "translation": {
        "title": "Auto Translation",
        "description": "Support for Japanese, English, and Turkish"
      },
      "fast": {
        "title": "Fast Processing",
        "description": "Process documents in seconds"
      }
    },
    "cta": {
      "title": "Get Started Today",
      "subtitle": "Create your free account"
    }
  },
  "user": {
    "dashboard": "Dashboard",
    "uploadFile": "Upload File",
    "myDocuments": "My Documents",
    "history": "History"
  },
  "admin": {
    "dashboard": "Admin Dashboard",
    "manageKeys": "Manage API Keys",
    "terminology": "Terminology",
    "analytics": "Analytics",
    "users": "Users"
  }
}
EOF

cat > public/locales/tr/translation.json << 'EOF'
{
  "common": {
    "login": "Giriş Yap",
    "logout": "Çıkış Yap",
    "register": "Kayıt Ol",
    "upload": "Yükle",
    "download": "İndir",
    "translate": "Çevir",
    "save": "Kaydet",
    "cancel": "İptal",
    "delete": "Sil",
    "edit": "Düzenle",
    "search": "Ara",
    "getStarted": "Başla",
    "startNow": "Hemen Başla"
  },
  "landing": {
    "hero": {
      "title": "Belge Çeviri Sistemi",
      "subtitle": "OCR ve otomatik çeviri ile belge işlemeyi kolaylaştırın"
    },
    "features": {
      "title": "Özellikler",
      "subtitle": "Güçlü araçlarla belge işlemeyi hızlandırın",
      "ocr": {
        "title": "OCR İşleme",
        "description": "Resim ve PDF'lerden metin çıkarın"
      },
      "translation": {
        "title": "Otomatik Çeviri",
        "description": "Japonca, İngilizce ve Türkçe desteği"
      },
      "fast": {
        "title": "Hızlı İşleme",
        "description": "Belgeleri saniyeler içinde işleyin"
      }
    },
    "cta": {
      "title": "Hemen Başlayın",
      "subtitle": "Ücretsiz hesap oluşturun"
    }
  },
  "user": {
    "dashboard": "Kontrol Paneli",
    "uploadFile": "Dosya Yükle",
    "myDocuments": "Belgelerim",
    "history": "Geçmiş"
  },
  "admin": {
    "dashboard": "Yönetici Paneli",
    "manageKeys": "API Anahtarları",
    "terminology": "Terminoloji",
    "analytics": "Analitik",
    "users": "Kullanıcılar"
  }
}
EOF

echo "✅ Çeviri dosyaları oluşturuldu"

echo ""
echo "🎉 Frontend dosyaları başarıyla oluşturuldu!"
echo ""
echo "📝 Sonraki adımlar:"
echo "1. cd frontend"
echo "2. npm install"
echo "3. cp .env.example .env"
echo "4. npm run dev"
echo ""
echo "⚠️  Not: Kalan dosyalar için PHASE3_FRONTEND_COMPLETE_GUIDE.md dosyasına bakın"
