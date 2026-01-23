# 📋 EROXAI STUDIO - JAPONYA İNŞAAT SEKTÖRÜ PLATFORMU
## Detaylı Uygulama Planı

**Proje Adı:** Eroxai Studio  
**Geliştirici:** Eroxai Studio  
**Destekçi:** Jumajapan Ltd.  
**Tarih:** 2026 Ocak

---

## 🎯 PROJE GENEL BAKIŞ

Japonya'da inşaat, yıkım ve yapım sektöründe çalışan profesyoneller için kapsamlı bir web platformu. Tüm resmi belgelerin düzenlenebildiği, hesaplama araçlarının bulunduğu, AI destekli, çok dilli, premium abonelik tabanlı sistem.

**Hedef Kitle:** Türkçe, Japonca ve İngilizce konuşan müteahhitler, mimarlar, mühendisler ve şirketler.

---

## 🏗️ TEKNİK MİMARİ

### Backend Seçimi: **Django (Python)**
**Neden Django?**
- Mevcut proje Django üzerine kurulu
- Güçlü ORM ve admin altyapısı
- RESTful API (Django REST Framework)
- Zengin paket ekosistemi
- Hızlı geliştirme
- **ÖNEMLİ:** Django'nun varsayılan admin paneli kesinlikle kullanılmayacak. Bunun yerine özel, modern React tabanlı admin paneli oluşturulacak.

### Teknoloji Stack

**Backend:**
- Framework: Django 5.0+
- API: Django REST Framework (DRF)
- Database: PostgreSQL 15 (mevcut)
- Cache: Redis 7
- Queue: Celery (Redis broker)
- File Storage: Local/S3
- Authentication: JWT (djangorestframework-simplejwt)
- **Admin Panel:** ❌ Django Admin KULLANILMAYACAK - Özel React Admin Panel

**Frontend:**
- Framework: React 18 (Mevcut - korunacak)
- Build Tool: Vite (Mevcut - korunacak)
- UI Library: Material-UI (Mevcut - korunacak)
- State Management: Zustand (Mevcut - korunacak)
- i18n: react-i18next (Mevcut - korunacak)
- PWA: Workbox/Service Worker

**External APIs:**
- OpenAI API (GPT-4) - AI Sohbet
- Google Cloud Vision API - OCR
- Stripe/PayPal API - Ödeme

**DevOps:**
- Web Server: Nginx
- WSGI: Gunicorn
- SSL: Let's Encrypt
- Deployment: Git + pip
- Process Manager: systemd

---

## 📊 VERİTABANI ŞEMASI

### Ana Tablolar

#### 1. Users & Authentication
```sql
users
- id (bigint, PK)
- username (string, unique)
- email (string, unique)
- email_verified_at (timestamp, nullable)
- password (string, hashed)
- role (enum: admin, user)
- locale (string, default: 'tr')
- created_at, updated_at

user_profiles
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- phone (string, nullable)
- company (string, nullable)
- title (string, nullable)
- address (text, nullable)
- avatar (string, nullable)
- created_at, updated_at
```

#### 2. Subscription System
```sql
subscriptions
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- plan_type (enum: free, premium)
- status (enum: active, cancelled, expired)
- started_at (timestamp)
- expires_at (timestamp, nullable)
- payment_provider (string, nullable) -- stripe, paypal
- payment_id (string, nullable)
- created_at, updated_at

subscription_plans
- id (bigint, PK)
- name (string) -- 'monthly', 'yearly'
- price (decimal)
- currency (string, default: 'JPY')
- duration_days (integer)
- features (json) -- premium features list
- is_active (boolean)
- created_at, updated_at
```

#### 3. Document Library
```sql
document_categories
- id (bigint, PK)
- name_ja (string) -- Japanese name
- name_tr (string) -- Turkish name
- name_en (string) -- English name
- slug (string, unique)
- description_ja, description_tr, description_en (text)
- icon (string, nullable)
- sort_order (integer)
- is_active (boolean)
- created_at, updated_at

document_templates
- id (bigint, PK)
- category_id (bigint, FK -> document_categories.id)
- name_ja, name_tr, name_en (string)
- slug (string, unique)
- description_ja, description_tr, description_en (text)
- template_file (string) -- PDF/Excel file path
- preview_image (string, nullable)
- fields_schema (json) -- Field definitions
- is_premium_only (boolean, default: false)
- is_active (boolean)
- created_at, updated_at

user_documents
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- template_id (bigint, FK -> document_templates.id)
- filled_data (json) -- User filled form data
- output_file (string, nullable) -- Generated PDF
- language (string, default: 'tr') -- Input language
- status (enum: draft, completed, archived)
- created_at, updated_at
```

#### 4. AI Chat
```sql
ai_chat_sessions
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- title (string, nullable)
- language (string, default: 'tr')
- created_at, updated_at

ai_chat_messages
- id (bigint, PK)
- session_id (bigint, FK -> ai_chat_sessions.id)
- role (enum: user, assistant)
- content (text)
- metadata (json, nullable)
- created_at
```

#### 5. OCR & Translation
```sql
ocr_documents
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- original_file (string)
- extracted_text (text)
- source_language (string)
- target_language (string)
- translated_text (text, nullable)
- status (enum: processing, completed, failed)
- created_at, updated_at
```

#### 6. Calculator Tools
```sql
calculator_logs
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- calculator_type (enum: ryoshusho, subo, beton, tatami, tsubo, material)
- input_data (json)
- result_data (json)
- created_at
```

#### 7. Site Management
```sql
site_settings
- id (bigint, PK)
- key (string, unique)
- value (json)
- updated_at

site_content_translations
- id (bigint, PK)
- key (string)
- language (string) -- tr, en, ja
- content (text)
- created_at, updated_at

themes
- id (bigint, PK)
- name (string)
- primary_color (string)
- secondary_color (string)
- preset (string)
- is_active (boolean)
- created_at, updated_at
```

---

## 🚀 UYGULAMA AŞAMALARI

### PHASE 1: Backend Enhancement (Django API)
**Süre:** 1 hafta

#### 1.1. Django Proje Yapılandırması
- [ ] Mevcut Django projesini gözden geçir
- [ ] PostgreSQL bağlantısını doğrula
- [ ] Redis cache yapılandırması
- [ ] Environment variables (.env) kontrolü
- [ ] Requirements.txt güncelleme

#### 1.2. Authentication System (DRF)
- [ ] Django REST Framework yapılandırması
- [ ] JWT authentication (simplejwt)
- [ ] User registration endpoint
- [ ] Login/Logout endpoints
- [ ] Email verification
- [ ] Password reset endpoints
- [ ] Token refresh mechanism

#### 1.3. Database Models & Migrations
- [ ] Yeni modeller için migration dosyaları
- [ ] Subscription models
- [ ] Document category/template models
- [ ] Calculator logs model
- [ ] Foreign key constraints
- [ ] Indexes optimization
- [ ] Fixtures/Seeders (test data)

#### 1.4. API Structure
- [ ] API routes organization (urls.py)
- [ ] ViewSets ve Serializers yapısı
- [ ] Request validation (serializers)
- [ ] Permissions classes
- [ ] Error handling middleware
- [ ] API documentation (drf-spectacular/swagger)

---

### PHASE 2: Subscription System
**Süre:** 1 hafta

#### 2.1. Subscription Models
- [ ] Subscription model
- [ ] SubscriptionPlan model
- [ ] Migration files
- [ ] Relationships

#### 2.2. Subscription Logic
- [ ] Free/Premium kontrolü
- [ ] Subscription middleware
- [ ] Feature access control
- [ ] Expiration handling

#### 2.3. Payment Integration
- [ ] Stripe Python SDK integration
- [ ] PayPal Python SDK integration
- [ ] Webhook handlers (Django views)
- [ ] Payment status tracking
- [ ] Payment history logging

#### 2.4. Subscription API
- [ ] GET /api/subscription/status
- [ ] POST /api/subscription/subscribe
- [ ] POST /api/subscription/cancel
- [ ] GET /api/subscription/plans

---

### PHASE 3: Document Library System
**Süre:** 2-3 hafta

#### 3.1. Document Categories
- [ ] Category model ve CRUD
- [ ] Multilingual support (TR/EN/JA)
- [ ] Category API endpoints
- [ ] Admin panel integration

#### 3.2. Document Templates
Japon inşaat belgeleri listesi:
- 工事請負契約書 (Sözleşme)
- 施工計画書 (İnşaat Planı)
- 請求書 (Fatura)
- 領収書 (Resmi Makbuz)
- 受領書 (Teslim Belgesi)
- アスベスト廃棄物処理計画書 (Asbest Atık Planı)
- 建築確認申請書 (Yapı Onay Başvurusu)
- 施工結果報告書 (İnşaat Sonuç Raporu)
- ... (daha fazlası)

#### 3.3. Template Management
- [ ] Template upload (PDF/Excel)
- [ ] Field schema definition
- [ ] Template preview
- [ ] Template versioning

#### 3.4. Document Editor
- [ ] Interactive form builder
- [ ] Field mapping (TR/EN -> JA)
- [ ] Live preview
- [ ] PDF generation (preserving Japanese layout)

#### 3.5. Document API
- [ ] GET /api/documents/categories
- [ ] GET /api/documents/templates
- [ ] GET /api/documents/templates/{id}
- [ ] POST /api/documents/fill
- [ ] GET /api/documents/{id}/download
- [ ] GET /api/documents/user

---

### PHASE 4: AI Chat Module
**Süre:** 1 hafta

#### 4.1. OpenAI Integration
- [ ] OpenAI Python SDK
- [ ] GPT-4 API calls
- [ ] Chat completion logic
- [ ] Error handling
- [ ] Rate limiting

#### 4.2. Chat System
- [ ] Chat session management
- [ ] Message history
- [ ] Context preservation
- [ ] Premium-only access

#### 4.3. Chat API
- [ ] POST /api/chat/sessions
- [ ] POST /api/chat/messages
- [ ] GET /api/chat/sessions/{id}/messages
- [ ] DELETE /api/chat/sessions/{id}

---

### PHASE 5: OCR & Translation Module
**Süre:** 1-2 hafta

#### 5.1. Google Cloud Vision API
- [ ] Google Cloud Vision Python SDK
- [ ] OCR service implementation
- [ ] Image preprocessing (PIL/Pillow)
- [ ] Text extraction
- [ ] Async processing (Celery tasks)

#### 5.2. Translation Service
- [ ] Multi-language translation
- [ ] Translation caching
- [ ] Batch translation

#### 5.3. OCR/Translation API
- [ ] POST /api/ocr/process
- [ ] POST /api/translate
- [ ] GET /api/ocr/documents
- [ ] GET /api/ocr/documents/{id}

---

### PHASE 6: Calculator Tools
**Süre:** 1 hafta

#### 6.1. Ryoshusho Calculator
- [ ] Tax calculation (included/excluded)
- [ ] Currency conversion (JPY/TRY/USD)
- [ ] Receipt generation

#### 6.2. Construction Calculators
- [ ] Subo (砂利/Çakıl) Price Calculator
- [ ] Concrete Volume Calculator
- [ ] Material Cost Calculator

#### 6.3. Area Calculators
- [ ] Tatami (畳) ↔ m² Converter
- [ ] Tsubo (坪) ↔ m² Converter

#### 6.4. Calculator API
- [ ] POST /api/calculators/ryoshusho
- [ ] POST /api/calculators/subo
- [ ] POST /api/calculators/concrete
- [ ] POST /api/calculators/tatami
- [ ] POST /api/calculators/tsubo
- [ ] POST /api/calculators/material

---

### PHASE 7: Advanced Admin Panel (React - Django Admin Değil!)
**Süre:** 2-3 hafta

**⚠️ ÖNEMLİ:** Django'nun varsayılan admin paneli kullanılmayacak. Modern, özel React tabanlı admin paneli oluşturulacak.

#### 7.1. Admin Panel Backend API
- [ ] Admin-only API endpoints
- [ ] Admin permissions middleware
- [ ] Site content management API
- [ ] User management API
- [ ] Subscription management API
- [ ] Template management API
- [ ] Theme management API
- [ ] Translation management API

#### 7.2. Admin Panel Frontend (React)
- [ ] Admin dashboard sayfası (mevcut güncellenecek)
- [ ] Site Content Management interface
- [ ] Multilingual content editor (TR/EN/JA)
- [ ] Homepage sections editor
- [ ] Navigation texts editor

#### 7.3. User & Subscription Management UI
- [ ] User list & search (DataGrid)
- [ ] Subscription management interface
- [ ] Premium activation/deactivation
- [ ] Usage statistics dashboard

#### 7.4. Document Template Management UI
- [ ] Template CRUD interface
- [ ] Category management
- [ ] Field schema editor (visual)
- [ ] Template preview

#### 7.5. Theme Management UI
- [ ] Color palette editor (color picker)
- [ ] Font selection dropdown
- [ ] Dark/Light theme toggle
- [ ] Theme preview (live)

#### 7.6. Multi-language Management UI
- [ ] Translation interface
- [ ] Key-value management (table)
- [ ] Bulk import/export
- [ ] Translation search & filter

---

### PHASE 8: Frontend Updates
**Süre:** 2-3 hafta

#### 8.1. New Pages
- [ ] Document Library page
- [ ] Document Detail & Editor page
- [ ] Calculator Tools page
- [ ] Subscription Plans page
- [ ] Payment page

#### 8.2. Component Updates
- [ ] Document card component
- [ ] Interactive form editor
- [ ] Calculator components
- [ ] Payment form

#### 8.3. API Integration
- [ ] Django REST Framework API endpoints integration
- [ ] JWT token management
- [ ] API error handling
- [ ] Loading states
- [ ] Success notifications

---

### PHASE 9: PWA Implementation
**Süre:** 1 hafta

#### 9.1. PWA Setup
- [ ] Manifest.json
- [ ] Service Worker
- [ ] Offline support
- [ ] Install prompt

#### 9.2. Caching Strategy
- [ ] Static assets caching
- [ ] API response caching
- [ ] Offline fallback

---

### PHASE 10: Testing & Deployment
**Süre:** 1-2 hafta

#### 10.1. Testing
- [ ] Unit tests (Django TestCase)
- [ ] API integration tests (DRF APITestCase)
- [ ] Frontend tests (Jest/React Testing Library)
- [ ] E2E tests (Playwright/Cypress)

#### 10.2. Security
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] File upload validation
- [ ] Rate limiting

#### 10.3. Performance
- [ ] Database optimization
- [ ] Caching strategy
- [ ] Image optimization
- [ ] Code minification

#### 10.4. Deployment
- [ ] VDS server setup
- [ ] Nginx configuration
- [ ] SSL certificate
- [ ] Domain configuration
- [ ] Monitoring setup

---

## 📁 PROJE YAPISI

```
document-translation-system/
├── backend/                  # Django backend (mevcut - güncellenecek)
│   ├── config/               # Django settings
│   ├── core/                 # Ana uygulama
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API views (DRF ViewSets)
│   │   ├── serializers.py    # DRF serializers
│   │   ├── urls.py           # API routes
│   │   └── services/         # Business logic
│   │       ├── openai_service.py
│   │       ├── google_vision_service.py
│   │       ├── pdf_service.py
│   │       └── payment_service.py
│   ├── apps/                 # Django apps (opsiyonel modüler yapı)
│   │   ├── auth/
│   │   ├── subscriptions/
│   │   ├── documents/
│   │   ├── chat/
│   │   ├── ocr/
│   │   └── calculators/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                 # React frontend (mevcut - güncellenecek)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx    # Özel admin paneli (Django admin değil!)
│   │   │   ├── DocumentLibrary.jsx   # Yeni
│   │   │   ├── DocumentEditor.jsx    # Yeni
│   │   │   ├── Calculators.jsx       # Yeni
│   │   │   ├── Subscription.jsx      # Yeni
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── admin/                # Admin panel bileşenleri
│   │   │   │   ├── SiteContentEditor.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── TemplateManager.jsx
│   │   │   │   └── ThemeEditor.jsx
│   │   │   └── ...
│   │   └── services/
│   │       ├── api.js                # Django REST API client
│   │       └── ...
│   └── package.json
│
└── docs/
    ├── API_DOCUMENTATION.md
    ├── DEPLOYMENT_GUIDE.md
    └── USER_GUIDE.md
```

---

## 🔐 GÜVENLİK ÖNLEMLERİ

1. **Authentication**
   - JWT token-based auth (djangorestframework-simplejwt)
   - Password hashing (Django's PBKDF2)
   - Email verification
   - Rate limiting (django-ratelimit)

2. **Authorization**
   - Role-based access control (RBAC)
   - Premium feature gates
   - Resource ownership checks

3. **Input Validation**
   - Django REST Framework Serializers
   - SQL injection prevention (Django ORM)
   - XSS protection (Django's auto-escaping)
   - File upload validation (django-storages)

4. **API Security**
   - CORS configuration
   - CSRF protection
   - API rate limiting
   - Request throttling

---

## 📱 SAYFA YAPISI

### Public Pages
1. **Ana Sayfa (Landing Page)**
   - Hero section
   - Features showcase
   - Subscription plans
   - Testimonials

2. **Giriş / Kayıt Sayfaları**
   - Login form
   - Registration form
   - Email verification
   - Password reset

### User Pages (Free)
3. **Belge Kütüphanesi**
   - Category list
   - Document list (read-only)
   - Document preview

### User Pages (Premium)
4. **Belge Detay & Düzenleyici**
   - Template view
   - Interactive form
   - Live preview
   - PDF download

5. **AI Sohbet**
   - Chat interface
   - Message history
   - New chat

6. **Çeviri Aracı**
   - File upload
   - OCR processing
   - Translation result

7. **Hesaplama Araçları**
   - Calculator tabs
   - Input forms
   - Results display

8. **Profil & Abonelik**
   - Profile settings
   - Subscription status
   - Payment history

### Admin Pages
9. **Admin Dashboard**
   - Statistics
   - Quick actions

10. **Site İçeriği Yönetimi**
    - Content editor
    - Multilingual texts

11. **Kullanıcı Yönetimi**
    - User list
    - Subscription management

12. **Belge Şablonu Yönetimi**
    - Template CRUD
    - Category management

13. **Tema Yönetimi**
    - Theme editor
    - Color picker

14. **Çoklu Dil Yönetimi**
    - Translation interface
    - Key management

---

## 🎨 TASARIM GEREKSİNİMLERİ

### Visual Design
- Modern, "görsel şölen" yaklaşımı
- CSS animations & transitions
- Gradient backgrounds
- Glassmorphism effects
- Scroll animations
- Interactive elements

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interfaces

### Theme System
- Light/Dark theme toggle
- Custom color palettes
- Font customization
- Admin-configurable

### PWA Features
- App-like experience
- Offline functionality
- Install prompt
- Push notifications (future)

---

## 📄 TELİF HAKKI VE LİSANS

### Footer Copyright
```
© 2026 Eroxai Studio. Tüm hakları saklıdır. Jumajapan Ltd. desteğiyle.
```

### License
- MIT License (veya uygun açık kaynak lisansı)
- LICENSE dosyası proje root'unda

---

## 📈 PERFORMANS HEDEFLERİ

- API Response Time: < 200ms
- Page Load Time: < 2s
- OCR Processing: < 5s
- Translation: < 3s
- PDF Generation: < 3s

---

## 🧪 TEST STRATEJİSİ

### Backend Tests
- Unit tests (PHPUnit)
- Feature tests
- API endpoint tests
- Service tests

### Frontend Tests
- Component tests (Jest)
- Integration tests
- E2E tests (Playwright)

### Manual Testing
- User acceptance testing
- Cross-browser testing
- Mobile device testing

---

## 📚 DOKÜMANTASYON

1. **API Documentation**
   - Endpoint list
   - Request/Response examples
   - Authentication guide

2. **Deployment Guide**
   - VDS setup instructions
   - Environment configuration
   - Nginx configuration
   - SSL setup

3. **User Guide**
   - Feature explanations
   - Step-by-step tutorials
   - FAQ

4. **Developer Guide**
   - Code structure
   - Contribution guidelines
   - Development setup

---

## ⏱️ TAHMİNİ SÜRE

**Toplam Süre:** 10-12 hafta

- Phase 1: 1-2 hafta
- Phase 2: 1 hafta
- Phase 3: 2-3 hafta
- Phase 4: 1 hafta
- Phase 5: 1-2 hafta
- Phase 6: 1 hafta
- Phase 7: 2 hafta
- Phase 8: 2-3 hafta
- Phase 9: 1 hafta
- Phase 10: 1-2 hafta

---

## 🚦 ÖNCELİK SIRASI

### Yüksek Öncelik (MVP)
1. Authentication & Subscription
2. Document Library (basic)
3. Document Editor (basic)
4. AI Chat
5. OCR/Translation

### Orta Öncelik
6. Calculator Tools
7. Advanced Admin Panel
8. PWA Support

### Düşük Öncelik (Future)
9. Project Management Dashboard
10. Forum/Community
11. Cost Simulation Tool
12. Equipment Rental Catalog

---

## 📝 ÖNEMLİ NOTLAR

- ✅ **Python/Django kullanılacak** - Backend Django olarak kalacak
- ❌ **Django Admin Panel KESİNLİKLE kullanılmayacak** - Özel React tabanlı modern admin paneli oluşturulacak
- Mevcut Django backend'i korunacak ve geliştirilecek
- Frontend React yapısı korunacak, API entegrasyonu Django REST Framework'e göre güncellenecek
- Veritabanı migration'ı dikkatli yapılacak
- API backward compatibility mümkün olduğunca korunacak
- Test coverage minimum %70 olmalı
- Admin paneli tamamen React + Material-UI ile modern bir arayüz olacak

---

**Son Güncelleme:** 2026 Ocak  
**Durum:** Planlama Aşaması  
**Sıradaki Adım:** Laravel proje kurulumu ve Phase 1 başlangıcı
