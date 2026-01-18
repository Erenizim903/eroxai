# 🚀 Document Translation System - Kurulum Rehberi

Bu rehber, Document Translation System'i yerel geliştirme ortamınızda veya production'da çalıştırmanız için gereken tüm adımları içerir.

---

## 📋 Gereksinimler

### Minimum Gereksinimler
- **Python**: 3.11 veya üzeri
- **Node.js**: 18 veya üzeri
- **PostgreSQL**: 15 veya üzeri
- **Redis**: 7 veya üzeri
- **Docker**: 20.10 veya üzeri (opsiyonel ama önerilen)
- **Docker Compose**: 2.0 veya üzeri (opsiyonel ama önerilen)

### Sistem Gereksinimleri
- **RAM**: Minimum 4GB (8GB önerilen)
- **Disk**: Minimum 10GB boş alan
- **OS**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)

---

## 🐳 Yöntem 1: Docker ile Kurulum (ÖNERİLEN)

Docker ile kurulum en hızlı ve kolay yöntemdir.

### Adım 1: Projeyi İndirin
```bash
cd C:/Users/eren/Desktop
cd document-translation-system
```

### Adım 2: Environment Dosyasını Oluşturun
```bash
# .env.example dosyasını kopyalayın
copy .env.example .env

# .env dosyasını düzenleyin ve gerekli değerleri girin
notepad .env
```

**Önemli değişkenler:**
```env
SECRET_KEY=your-very-secret-key-here-change-this
OPENAI_API_KEY=your-openai-key-here
DATABASE_PASSWORD=strong-password-here
```

### Adım 3: Docker Container'ları Başlatın
```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izleyin
docker-compose logs -f
```

### Adım 4: Database Migration
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

### Adım 5: Uygulamayı Test Edin
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/docs/

### Docker Komutları
```bash
# Servisleri durdur
docker-compose stop

# Servisleri başlat
docker-compose start

# Servisleri yeniden başlat
docker-compose restart

# Servisleri kaldır
docker-compose down

# Servisleri kaldır ve volume'leri sil
docker-compose down -v

# Logları görüntüle
docker-compose logs -f [service_name]

# Container'a gir
docker-compose exec [service_name] bash
```

---

## 💻 Yöntem 2: Manuel Kurulum

Docker kullanmak istemiyorsanız, manuel kurulum yapabilirsiniz.

### Backend Kurulumu

#### Adım 1: PostgreSQL Kurulumu
```bash
# PostgreSQL'i indirin ve kurun
# https://www.postgresql.org/download/

# Database oluşturun
psql -U postgres
CREATE DATABASE document_translation_db;
CREATE USER doc_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE document_translation_db TO doc_user;
\q
```

#### Adım 2: Redis Kurulumu
```bash
# Windows için Redis indirin
# https://github.com/microsoftarchive/redis/releases

# Redis'i başlatın
redis-server
```

#### Adım 3: Python Virtual Environment
```bash
cd backend

# Virtual environment oluştur
python -m venv venv

# Aktif et (Windows)
venv\Scripts\activate

# Aktif et (Linux/Mac)
source venv/bin/activate

# Bağımlılıkları yükle
pip install -r requirements.txt
```

#### Adım 4: Tesseract OCR Kurulumu
```bash
# Windows için Tesseract indirin
# https://github.com/UB-Mannheim/tesseract/wiki

# Kurulum sonrası path'i .env dosyasına ekleyin
TESSERACT_PATH=C:/Program Files/Tesseract-OCR/tesseract.exe
```

#### Adım 5: Environment Değişkenleri
```bash
# .env dosyası oluşturun
copy .env.example .env

# Değişkenleri düzenleyin
notepad .env
```

**Backend .env örneği:**
```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_NAME=document_translation_db
DATABASE_USER=doc_user
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your-openai-key
```

#### Adım 6: Database Migration
```bash
# Migration'ları oluştur
python manage.py makemigrations

# Migration'ları uygula
python manage.py migrate

# Superuser oluştur
python manage.py createsuperuser

# Static dosyaları topla
python manage.py collectstatic --noinput
```

#### Adım 7: Backend'i Başlat
```bash
# Development server
python manage.py runserver

# Veya Gunicorn ile (production-like)
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

#### Adım 8: Celery Worker'ı Başlat
```bash
# Yeni terminal açın ve virtual environment'ı aktif edin
cd backend
venv\Scripts\activate

# Celery worker'ı başlat
celery -A config worker -l info

# Celery beat'i başlat (başka terminal)
celery -A config beat -l info
```

### Frontend Kurulumu (Sonraki Phase)

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build
```

---

## 🔧 Konfigürasyon

### Database Ayarları

**PostgreSQL Performans Optimizasyonu:**
```sql
-- postgresql.conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
```

### Redis Ayarları

**redis.conf:**
```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### Nginx Ayarları (Production)

```nginx
server {
    listen 80;
    server_name eroxai.com www.eroxai.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name eroxai.com www.eroxai.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/eroxai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eroxai.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin
    location /admin/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Static files
    location /static/ {
        alias /usr/share/nginx/html/static/;
    }
    
    # Media files
    location /media/ {
        alias /usr/share/nginx/html/media/;
    }
}
```

---

## 🧪 Test

### Backend Testleri
```bash
cd backend

# Tüm testleri çalıştır
python manage.py test

# Belirli bir app'i test et
python manage.py test apps.authentication

# Coverage ile test
pytest --cov=apps --cov-report=html
```

### Frontend Testleri (Sonraki Phase)
```bash
cd frontend

# Unit testler
npm run test

# E2E testler
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🐛 Sorun Giderme

### Yaygın Sorunlar

#### 1. Database Bağlantı Hatası
```bash
# PostgreSQL'in çalıştığını kontrol edin
# Windows
services.msc

# Linux
sudo systemctl status postgresql

# Database'in var olduğunu kontrol edin
psql -U postgres -l
```

#### 2. Redis Bağlantı Hatası
```bash
# Redis'in çalıştığını kontrol edin
redis-cli ping
# Yanıt: PONG
```

#### 3. Migration Hataları
```bash
# Migration'ları sıfırla
python manage.py migrate --fake-initial

# Veya database'i sıfırla
python manage.py flush
python manage.py migrate
```

#### 4. Port Kullanımda Hatası
```bash
# Windows'ta port'u kullanan process'i bul
netstat -ano | findstr :8000

# Process'i sonlandır
taskkill /PID <PID> /F
```

#### 5. Tesseract OCR Bulunamadı
```bash
# Tesseract path'ini kontrol edin
tesseract --version

# .env dosyasında path'i düzeltin
TESSERACT_PATH=C:/Program Files/Tesseract-OCR/tesseract.exe
```

---

## 📊 Performans Optimizasyonu

### Database
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'CONN_MAX_AGE': 600,  # Connection pooling
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}
```

### Caching
```python
# Cache timeout ayarları
CACHE_TTL = 60 * 15  # 15 dakika

# Translation cache
TRANSLATION_CACHE_TTL = 60 * 60 * 24  # 24 saat
```

### Celery
```python
# Celery optimizasyonu
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30 dakika
```

---

## 🔐 Güvenlik

### Production Checklist
- [ ] `DEBUG = False` yapıldı
- [ ] `SECRET_KEY` güçlü ve benzersiz
- [ ] `ALLOWED_HOSTS` doğru ayarlandı
- [ ] HTTPS aktif
- [ ] CORS doğru konfigüre edildi
- [ ] Rate limiting aktif
- [ ] File upload validation aktif
- [ ] Database şifreleri güçlü
- [ ] API key'ler güvenli saklanıyor
- [ ] Backup sistemi kuruldu

### Güvenlik Ayarları
```python
# settings.py (Production)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

---

## 📦 Deployment

### Production Deployment (eroxai.com)

#### 1. Server Hazırlığı
```bash
# Ubuntu 22.04 LTS
sudo apt update && sudo apt upgrade -y

# Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose kurulumu
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Proje Deployment
```bash
# Projeyi klonla
git clone <repository-url>
cd document-translation-system

# Environment dosyasını oluştur
cp .env.example .env
nano .env  # Production değerlerini gir

# SSL sertifikası al (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d eroxai.com -d www.eroxai.com

# Docker container'ları başlat
docker-compose -f docker-compose.prod.yml up -d

# Migration'ları çalıştır
docker-compose exec backend python manage.py migrate

# Static dosyaları topla
docker-compose exec backend python manage.py collectstatic --noinput

# Superuser oluştur
docker-compose exec backend python manage.py createsuperuser
```

#### 3. Monitoring
```bash
# Logları izle
docker-compose logs -f

# Container durumunu kontrol et
docker-compose ps

# Resource kullanımını kontrol et
docker stats
```

---

## 🔄 Backup & Restore

### Database Backup
```bash
# Backup al
docker-compose exec db pg_dump -U postgres document_translation_db > backup_$(date +%Y%m%d).sql

# Restore et
docker-compose exec -T db psql -U postgres document_translation_db < backup_20240101.sql
```

### Media Files Backup
```bash
# Media dosyalarını yedekle
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/

# Restore et
tar -xzf media_backup_20240101.tar.gz
```

---

## 📞 Destek

### Dokümantasyon
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [TODO List](./TODO.md)
- [Phase 1 Summary](./PHASE1_SUMMARY.md)
- [API Documentation](http://localhost:8000/api/docs/)

### İletişim
- **Email**: support@eroxai.com
- **Website**: https://eroxai.com

---

## ✅ Kurulum Tamamlandı!

Tebrikler! Document Translation System başarıyla kuruldu. 

**Sonraki Adımlar:**
1. Admin paneline giriş yapın: http://localhost:8000/admin
2. İlk API key'inizi oluşturun
3. Test belgesi yükleyin
4. Çeviri özelliklerini test edin

**İyi çalışmalar! 🚀**
