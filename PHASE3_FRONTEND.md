# 🎨 Phase 3: Frontend Development (React 18)

## 📋 Görev Özeti

Modern, responsive, profesyonel React frontend oluşturma - eroxai.org için hazır.

---

## 🎯 Hedefler

### 1. Landing Page
- Hero section
- Feature showcase
- Login/Register buttons
- Call-to-action

### 2. User Panel
- File upload (drag & drop)
- OCR result display
- Translation interface
- Live preview
- Document download

### 3. Admin Panel
- Document template upload
- Field selection
- API key management
- Terminology dictionary
- Analytics dashboard

### 4. Multi-language Support
- Japanese (primary)
- English
- Turkish
- Language selector

---

## 🛠️ Technology Stack

### Core
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety (optional)

### UI Library
- **Material-UI (MUI)** - Professional components
- **@mui/icons-material** - Icons
- **@mui/x-data-grid** - Data tables

### State Management
- **Zustand** - Simple, modern state management

### Routing
- **React Router v6** - Client-side routing

### API & Data
- **Axios** - HTTP client
- **React Query** - Data fetching & caching

### Internationalization
- **react-i18next** - Multi-language support
- **i18next** - Translation framework

### Forms
- **React Hook Form** - Form management
- **Yup** - Validation

### File Upload
- **react-dropzone** - Drag & drop upload

### Additional
- **date-fns** - Date formatting
- **recharts** - Charts for analytics

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── locales/
│   │   ├── ja/
│   │   │   └── translation.json
│   │   ├── en/
│   │   │   └── translation.json
│   │   └── tr/
│   │       └── translation.json
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── LanguageSelector.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── FieldSelector.jsx
│   │   │   ├── APIKeyManager.jsx
│   │   │   ├── TerminologyManager.jsx
│   │   │   └── Analytics.jsx
│   │   └── user/
│   │       ├── FileUpload.jsx
│   │       ├── OCRResult.jsx
│   │       ├── TranslationView.jsx
│   │       ├── LivePreview.jsx
│   │       └── DocumentDownload.jsx
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── ocrService.js
│   │   ├── translationService.js
│   │   └── adminService.js
│   │
│   ├── store/
│   │   ├── authStore.js
│   │   ├── ocrStore.js
│   │   └── translationStore.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useOCR.js
│   │   └── useTranslation.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── i18n/
│   │   └── config.js
│   │
│   ├── theme/
│   │   └── theme.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

---

## 🎨 Design System

### Color Palette
```css
Primary: #1976d2 (Blue)
Secondary: #dc004e (Pink)
Success: #4caf50 (Green)
Warning: #ff9800 (Orange)
Error: #f44336 (Red)
Background: #f5f5f5 (Light Gray)
Text: #212121 (Dark Gray)
```

### Typography
```
Font Family: 'Roboto', 'Noto Sans JP', sans-serif
Headings: 700 weight
Body: 400 weight
Small: 300 weight
```

### Breakpoints
```
xs: 0px
sm: 600px
md: 900px
lg: 1200px
xl: 1536px
```

---

## 🔄 User Flow

### User Journey
```
Landing Page → Login → User Dashboard → 
Upload File → OCR Processing → View Results → 
Translate → Preview → Download
```

### Admin Journey
```
Landing Page → Login (Admin) → Admin Dashboard → 
Upload Template → Select Fields → Manage API Keys → 
View Analytics
```

---

## 📝 Key Features

### 1. Authentication
- JWT token management
- Auto-refresh tokens
- Protected routes
- Role-based access

### 2. File Upload
- Drag & drop
- File type validation
- Size limit (10MB)
- Progress indicator
- Multiple file support

### 3. OCR Display
- Text preview
- Confidence score
- Language detection
- Field detection results

### 4. Translation
- Source/target language selector
- Terminology toggle
- Live preview
- Batch translation

### 5. Admin Features
- Template management
- Field selection (drag & drop)
- API key CRUD
- Terminology dictionary
- Usage analytics

---

## 🌐 Internationalization

### Language Files Structure
```json
{
  "common": {
    "login": "ログイン",
    "logout": "ログアウト",
    "upload": "アップロード"
  },
  "user": {
    "dashboard": "ダッシュボード",
    "uploadFile": "ファイルをアップロード"
  },
  "admin": {
    "manageKeys": "APIキー管理",
    "terminology": "用語辞書"
  }
}
```

---

## 🔐 Security

### Authentication
- JWT stored in httpOnly cookies (if possible)
- Or localStorage with XSS protection
- Auto-logout on token expiry
- CSRF protection

### API Calls
- Axios interceptors for auth headers
- Error handling
- Retry logic
- Request cancellation

---

## 📊 State Management (Zustand)

### Auth Store
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  login: (credentials) => {},
  logout: () => {},
  refreshToken: () => {}
}
```

### OCR Store
```javascript
{
  results: [],
  currentResult: null,
  isProcessing: false,
  uploadFile: (file) => {},
  getResult: (id) => {}
}
```

### Translation Store
```javascript
{
  translations: [],
  currentTranslation: null,
  translate: (text, targetLang) => {},
  batchTranslate: (texts) => {}
}
```

---

## 🚀 Implementation Steps

### Step 1: Project Setup
- [x] Create Vite + React project
- [ ] Install dependencies
- [ ] Configure Vite
- [ ] Setup folder structure

### Step 2: Core Components
- [ ] Navbar
- [ ] Footer
- [ ] Loading spinner
- [ ] Error boundary

### Step 3: Authentication
- [ ] Login page
- [ ] Register page
- [ ] Auth service
- [ ] Protected routes

### Step 4: User Panel
- [ ] File upload component
- [ ] OCR result display
- [ ] Translation interface
- [ ] Live preview
- [ ] Download functionality

### Step 5: Admin Panel
- [ ] Dashboard
- [ ] Template upload
- [ ] Field selector
- [ ] API key manager
- [ ] Terminology manager
- [ ] Analytics

### Step 6: Internationalization
- [ ] i18next setup
- [ ] Language files (JA, EN, TR)
- [ ] Language selector
- [ ] RTL support (if needed)

### Step 7: Testing & Polish
- [ ] Component testing
- [ ] E2E testing
- [ ] Responsive design
- [ ] Performance optimization

---

## 📱 Responsive Design

### Mobile (< 600px)
- Single column layout
- Hamburger menu
- Touch-optimized buttons
- Simplified forms

### Tablet (600px - 900px)
- Two column layout
- Collapsible sidebar
- Optimized spacing

### Desktop (> 900px)
- Full layout
- Sidebar navigation
- Multi-column grids

---

## 🎯 Success Criteria

- ✅ Modern, professional UI
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Multi-language support (JA, EN, TR)
- ✅ All API endpoints integrated
- ✅ File upload working
- ✅ OCR display functional
- ✅ Translation working
- ✅ Admin panel complete
- ✅ Authentication secure
- ✅ Error handling robust
- ✅ Loading states clear
- ✅ Performance optimized

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@mui/x-data-grid": "^6.18.0",
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.5",
    "@tanstack/react-query": "^5.17.0",
    "react-hook-form": "^7.49.3",
    "yup": "^1.3.3",
    "react-i18next": "^14.0.0",
    "i18next": "^23.7.0",
    "react-dropzone": "^14.2.3",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0"
  }
}
```

---

**Let's build an amazing frontend! 🚀**
