# 🚀 Quick Start Guide - Document Translation System

Bu rehber, projeyi hızlıca çalıştırmanız için gereken minimum adımları içerir.

---

## ⚡ Hızlı Başlangıç (5 Dakika)

### 1. Proje Dizinine Gidin
```bash
cd C:/Users/eren/Desktop/document-translation-system
```

### 2. Environment Dosyası Oluşturun
```bash
# .env.example'dan kopyalayın
copy .env.example .env

# Veya manuel olarak oluşturun
notepad .env
```

**Minimum .env içeriği:**
```env
SECRET_KEY=django-insecure-change-this-in-production-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_NAME=document_translation_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=db
DATABASE_PORT=5432

REDIS_HOST=redis
REDIS_PORT=6379

OPENAI_API_KEY=your-openai-key-here

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Docker ile Başlatın
```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izleyin
docker-compose logs -f
```

### 4. Database Setup
```bash
# Backend container'a girin
docker-compose exec backend bash

# Migration'ları çalıştırın
python manage.py makemigrations
python manage.py migrate

# Superuser oluşturun
python manage.py createsuperuser

# Container'dan çıkın
exit
```

### 5. Uygulamayı Test Edin
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/docs/
- **Health Check**: http://localhost:8000/api/health/

---

## 📝 Önemli Notlar

### Şu An Çalışan Özellikler:
✅ Django backend
✅ PostgreSQL database
✅ Redis cache
✅ Celery worker
✅ Admin panel
✅ API endpoints (authentication, documents, translation, ocr, analytics)
✅ Swagger/ReDoc documentation

### Henüz Tamamlanmamış:
⏳ Frontend (React) - Phase 1'de oluşturulacak
⏳ OCR servisleri - Phase 4'te implement edilecek
⏳ Translation servisleri - Phase 5'te implement edilecek
⏳ Analytics dashboard - Phase 8'de oluşturulacak

---

## 🔧 Yararlı Komutlar

### Docker Komutları
```bash
# Servisleri durdur
docker-compose stop

# Servisleri başlat
docker-compose start

# Servisleri yeniden başlat
docker-compose restart

# Logları görüntüle
docker-compose logs -f [service_name]

# Container'a gir
docker-compose exec [service_name] bash

# Servisleri kaldır
docker-compose down

# Servisleri kaldır ve volume'leri sil
docker-compose down -v
```

### Django Komutları
```bash
# Backend container'da çalıştırın
docker-compose exec backend bash

# Migration oluştur
python manage.py makemigrations

# Migration uygula
python manage.py migrate

# Superuser oluştur
python manage.py createsuperuser

# Shell aç
python manage.py shell

# Test çalıştır
python manage.py test

# Static dosyaları topla
python manage.py collectstatic
```

---

## 🐛 Sorun Giderme

### Port Kullanımda Hatası
```bash
# Windows'ta port'u kullanan process'i bul
netstat -ano | findstr :8000

# Process'i sonlandır
taskkill /PID <PID> /F
```

### Database Bağlantı Hatası
```bash
# PostgreSQL container'ını kontrol et
docker-compose ps db

# PostgreSQL loglarını kontrol et
docker-compose logs db

# Container'ı yeniden başlat
docker-compose restart db
```

### Migration Hataları
```bash
# Migration'ları sıfırla
docker-compose exec backend python manage.py migrate --fake-initial

# Veya database'i sıfırla
docker-compose exec backend python manage.py flush
docker-compose exec backend python manage.py migrate
```

---

## 📚 Sonraki Adımlar

1. **Admin Panel'e Giriş Yapın**
   - URL: http://localhost:8000/admin
   - Superuser bilgilerinizle giriş yapın

2. **İlk API Key Oluşturun**
   - Admin panel > API Keys > Add API Key

3. **API Dokümantasyonunu İnceleyin**
   - Swagger: http://localhost:8000/api/docs/
   - ReDoc: http://localhost:8000/api/redoc/

4. **Frontend Geliştirmeye Başlayın**
   - Phase 1'de React frontend oluşturulacak

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/login-api-key/` - Login with API key
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/refresh/` - Refresh token
- `GET /api/auth/me/` - Current user info

### Documents
- `GET /api/documents/templates/` - List templates
- `POST /api/documents/templates/` - Create template
- `GET /api/documents/documents/` - List documents
- `POST /api/documents/documents/` - Upload document

### Translation
- `POST /api/translation/translate/` - Translate text
- `GET /api/translation/terminology/` - List terminology
- `POST /api/translation/terminology/` - Add term

### OCR
- `POST /api/ocr/extract/` - Extract text from image
- `POST /api/ocr/process-photo/` - Process photo

### Analytics
- `GET /api/analytics/overview/` - System overview
- `GET /api/analytics/usage-logs/` - Usage logs

---

## 💡 İpuçları

1. **Development Modu**
   - DEBUG=True olduğunda detaylı hata mesajları görürsünüz
   - Production'da mutlaka DEBUG=False yapın

2. **API Testing**
   - Postman veya Insomnia kullanabilirsiniz
   - Swagger UI'dan direkt test edebilirsiniz

3. **Database Yönetimi**
   - pgAdmin kullanarak database'i görselleştirebilirsiniz
   - Django admin panel'den de yönetebilirsiniz

4. **Log İzleme**
   - `docker-compose logs -f` ile tüm logları izleyin
   - Belirli servis için: `docker-compose logs -f backend`

---

## 📞 Yardım

Sorun yaşarsanız:
1. Logları kontrol edin: `docker-compose logs`
2. Container durumunu kontrol edin: `docker-compose ps`
3. SETUP_GUIDE.md dosyasına bakın
4. DEPLOYMENT_GUIDE_EROXAI.md dosyasına bakın

**Başarılar! 🚀**
