# 🧪 Testing Guide - Document Translation System

Bu rehber, projenin test edilmesi için gereken adımları içerir.

---

## ✅ Tamamlanan Dosyalar (90+ dosya)

### Proje Yapısı
- ✅ Tüm konfigürasyon dosyaları
- ✅ Docker ve Nginx ayarları
- ✅ 8 Django app (authentication, documents, translation, ocr, analytics, admin_panel, user_panel, terminology)
- ✅ 15 database model
- ✅ 40+ API endpoint
- ✅ Admin panel konfigürasyonları
- ✅ Serializers ve Views
- ✅ URL routing
- ✅ Permissions ve Signals

---

## 🚀 Test Adımları

### 1. Docker ile Başlatma (ÖNERİLEN)

```bash
# Proje dizinine git
cd C:/Users/eren/Desktop/document-translation-system

# .env dosyası oluştur
copy .env.example .env

# .env dosyasını düzenle (önemli!)
notepad .env
```

**.env dosyasında değiştirmeniz gerekenler:**
```env
SECRET_KEY=your-unique-secret-key-here-change-this
OPENAI_API_KEY=your-openai-key-here
```

```bash
# Docker container'ları başlat
docker-compose up -d

# Logları izle
docker-compose logs -f backend

# Backend container'a gir
docker-compose exec backend bash

# Migration'ları oluştur ve uygula
python manage.py makemigrations
python manage.py migrate

# Superuser oluştur
python manage.py createsuperuser

# Container'dan çık
exit
```

### 2. Manuel Test (Virtual Environment ile)

Eğer Docker kullanmak istemiyorsanız:

```bash
# Backend dizinine git
cd document-translation-system/backend

# Virtual environment oluştur
python -m venv venv

# Virtual environment'ı aktif et
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Dependencies yükle
pip install -r requirements.txt

# PostgreSQL ve Redis'in çalıştığından emin ol
# Sonra migration'ları çalıştır
python manage.py makemigrations
python manage.py migrate

# Superuser oluştur
python manage.py createsuperuser

# Development server'ı başlat
python manage.py runserver
```

---

## 🧪 Kritik Testler

### Test 1: Django Check
```bash
docker-compose exec backend python manage.py check
```
**Beklenen Sonuç:** `System check identified no issues (0 silenced).`

### Test 2: Migrations
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```
**Beklenen Sonuç:** Tüm migration'lar başarıyla uygulanmalı

### Test 3: Admin Panel Erişimi
- URL: http://localhost:8000/admin
- Superuser bilgileriyle giriş yap
- **Beklenen Sonuç:** Admin panel açılmalı ve tüm modeller görünmeli

### Test 4: API Documentation
- Swagger: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/
- **Beklenen Sonuç:** API dokümantasyonu görünmeli

### Test 5: Health Check
```bash
curl http://localhost:8000/api/health/
```
**Beklenen Sonuç:** `{"status": "healthy"}`

### Test 6: Authentication Endpoints
```bash
# User oluştur (admin panel'den veya)
curl -X POST http://localhost:8000/api/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123","role":"user"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

### Test 7: Database Bağlantısı
```bash
docker-compose exec db psql -U postgres -d document_translation_db -c "\dt"
```
**Beklenen Sonuç:** Tüm tablolar listelenmeli

### Test 8: Redis Bağlantısı
```bash
docker-compose exec redis redis-cli ping
```
**Beklenen Sonuç:** `PONG`

---

## 📊 Test Checklist

### Backend Tests
- [ ] Django check geçiyor
- [ ] Migration'lar başarıyla oluşturuluyor
- [ ] Migration'lar başarıyla uygulanıyor
- [ ] Admin panel erişilebilir
- [ ] Superuser oluşturulabiliyor
- [ ] API dokümantasyonu görünüyor
- [ ] Health check endpoint çalışıyor
- [ ] Database bağlantısı çalışıyor
- [ ] Redis bağlantısı çalışıyor
- [ ] Celery worker başlıyor

### API Endpoint Tests
- [ ] Authentication endpoints çalışıyor
- [ ] Document endpoints çalışıyor
- [ ] Translation endpoints çalışıyor
- [ ] OCR endpoints çalışıyor
- [ ] Analytics endpoints çalışıyor
- [ ] Admin panel endpoints çalışıyor
- [ ] User panel endpoints çalışıyor

### Model Tests
- [ ] User model çalışıyor
- [ ] APIKey model çalışıyor
- [ ] Document model çalışıyor
- [ ] Translation model çalışıyor
- [ ] OCR model çalışıyor
- [ ] Analytics models çalışıyor

---

## 🐛 Yaygın Sorunlar ve Çözümleri

### Sorun 1: Port Already in Use
```bash
# Windows'ta port'u kullanan process'i bul
netstat -ano | findstr :8000

# Process'i sonlandır
taskkill /PID <PID> /F
```

### Sorun 2: Database Connection Error
```bash
# PostgreSQL container'ını kontrol et
docker-compose ps db

# PostgreSQL loglarını kontrol et
docker-compose logs db

# Container'ı yeniden başlat
docker-compose restart db
```

### Sorun 3: Migration Errors
```bash
# Migration'ları sıfırla
docker-compose exec backend python manage.py migrate --fake-initial

# Veya database'i tamamen sıfırla
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
```

### Sorun 4: Import Errors
```bash
# Dependencies'i yeniden yükle
docker-compose exec backend pip install -r requirements.txt

# Container'ı rebuild et
docker-compose build backend
docker-compose up -d backend
```

---

## 📝 Test Sonuçları Raporu

Test tamamlandıktan sonra bu bölümü doldurun:

### Başarılı Testler
- [ ] Django check: ✅/❌
- [ ] Migrations: ✅/❌
- [ ] Admin panel: ✅/❌
- [ ] API docs: ✅/❌
- [ ] Health check: ✅/❌
- [ ] Database: ✅/❌
- [ ] Redis: ✅/❌
- [ ] Authentication: ✅/❌

### Bulunan Hatalar
1. 
2. 
3. 

### Notlar
- 
- 
- 

---

## 🔄 Sonraki Adımlar

Test tamamlandıktan sonra:

1. **Frontend Geliştirme** (Phase 2)
   - React uygulaması oluştur
   - Material-UI entegrasyonu
   - API entegrasyonu

2. **OCR Servisi** (Phase 4)
   - Tesseract entegrasyonu
   - Image preprocessing
   - Smart field detection

3. **Translation Servisi** (Phase 5)
   - OpenAI API entegrasyonu
   - Google Translate fallback
   - Terminology dictionary

4. **Production Deployment** (Phase 10)
   - eroxai.org'a deploy
   - SSL sertifikası
   - Domain konfigürasyonu

---

## 📞 Yardım

Sorun yaşarsanız:
1. Docker loglarını kontrol edin: `docker-compose logs`
2. QUICK_START.md dosyasına bakın
3. SETUP_GUIDE.md dosyasına bakın
4. DEPLOYMENT_GUIDE_EROXAI.md dosyasına bakın

**Test başarılar! 🚀**
