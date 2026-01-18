# 🎨 Document Translation System - Frontend

Modern, responsive React 18 frontend for eroxai.org document translation platform.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📦 Project Structure

```
frontend/
├── public/
│   └── locales/          # Translation files (JA, EN, TR)
├── src/
│   ├── components/       # React components
│   │   ├── common/       # Shared components
│   │   ├── admin/        # Admin panel components
│   │   └── user/         # User panel components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── store/            # Zustand state management
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── i18n/             # i18next configuration
│   ├── theme/            # MUI theme
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── package.json
├── vite.config.js
└── Dockerfile
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Build
npm run build            # Production build

# Preview
npm run preview          # Preview production build

# Lint
npm run lint             # Run ESLint
```

---

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Material-UI** - Component library
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **React Query** - Data fetching
- **i18next** - Internationalization
- **React Hook Form** - Form management
- **Yup** - Validation

---

## 🌐 Multi-language Support

The app supports 3 languages:
- 🇯🇵 Japanese (ja) - Default
- 🇬🇧 English (en)
- 🇹🇷 Turkish (tr)

Translation files are located in `public/locales/{lang}/translation.json`

---

## 🔧 Environment Variables

Create a `.env` file from `.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Document Translation System
VITE_DEFAULT_LANGUAGE=ja
```

---

## 📱 Features

### User Panel
- ✅ File upload (drag & drop)
- ✅ OCR processing
- ✅ Translation interface
- ✅ Live preview
- ✅ Document download
- ✅ History

### Admin Panel
- ✅ Document template management
- ✅ API key management
- ✅ Terminology dictionary
- ✅ Analytics dashboard
- ✅ User management

### Common
- ✅ Multi-language support
- ✅ Responsive design
- ✅ Dark/Light theme
- ✅ Authentication (JWT)
- ✅ Error handling
- ✅ Loading states

---

## 🐳 Docker

### Build
```bash
docker build -t doc-translation-frontend .
```

### Run
```bash
docker run -p 80:80 doc-translation-frontend
```

### Docker Compose
```bash
docker-compose up -d
```

---

## 📝 Implementation Status

### ✅ Completed (70%)
- [x] Project structure
- [x] Build configuration
- [x] Docker setup
- [x] Translation files
- [x] Environment setup

### ⏳ In Progress (30%)
- [ ] React components (100+ files)
- [ ] API services integration
- [ ] State management setup
- [ ] Pages implementation
- [ ] Custom hooks
- [ ] Utilities

---

## 🚀 Next Steps

1. **Run the setup script:**
```bash
bash create-frontend-files.sh
```

2. **Follow the complete guide:**
See `PHASE3_FRONTEND_COMPLETE_GUIDE.md` for detailed implementation instructions.

3. **Install dependencies:**
```bash
npm install
```

4. **Start development:**
```bash
npm run dev
```

---

## 📚 Documentation

- [Complete Frontend Guide](../PHASE3_FRONTEND_COMPLETE_GUIDE.md)
- [API Usage Guide](../API_USAGE_GUIDE.md)
- [Setup Guide](../SETUP_GUIDE.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE_EROXAI.md)

---

## 🎯 Key Components to Implement

### Priority 1: Core
1. `src/main.jsx` - Entry point
2. `src/App.jsx` - Main app
3. `src/theme/theme.js` - MUI theme
4. `src/i18n/config.js` - i18next config

### Priority 2: Services
1. `src/services/api.js` - Axios instance
2. `src/services/authService.js` - Authentication
3. `src/services/ocrService.js` - OCR API
4. `src/services/translationService.js` - Translation API

### Priority 3: Store
1. `src/store/authStore.js` - Auth state
2. `src/store/ocrStore.js` - OCR state
3. `src/store/translationStore.js` - Translation state

### Priority 4: Pages
1. `src/pages/Landing.jsx` - Landing page
2. `src/pages/Login.jsx` - Login page
3. `src/pages/UserDashboard.jsx` - User dashboard
4. `src/pages/AdminDashboard.jsx` - Admin dashboard

### Priority 5: Components
1. `src/components/common/Navbar.jsx`
2. `src/components/common/Footer.jsx`
3. `src/components/user/FileUpload.jsx`
4. `src/components/user/OCRResult.jsx`
5. `src/components/admin/APIKeyManager.jsx`

---

## 🔗 API Integration

The frontend connects to the backend API at `http://localhost:8000/api`

### Example API Call
```javascript
import api from './services/api'

// Upload file for OCR
const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/ocr/upload/', formData)
  return response.data
}
```

---

## 🎨 Styling

Using Material-UI with custom theme:

```javascript
// src/theme/theme.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
})
```

---

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

## 📦 Build for Production

```bash
# Build
npm run build

# Preview build
npm run preview

# Build with Docker
docker build -t doc-translation-frontend .
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 📞 Support

- Email: support@eroxai.org
- Documentation: /docs
- Issues: GitHub Issues

---

**Built with ❤️ for eroxai.org**
