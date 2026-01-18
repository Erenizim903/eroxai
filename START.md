# 🚀 Projeyi Başlatma Rehberi

## ⚠️ ÖNEMLİ: İlk Adım

**.env dosyasını düzenleyin:**
```bash
notepad .env
```

**Değiştirmeniz gereken değerler:**
1. `OPENAI_API_KEY=your-openai-key-here`
   - OpenAI API key'inizi buraya ekleyin
   - https://platform.openai.com/api-keys adresinden alabilirsiniz

2. (İsteğe bağlı) `GOOGLE_TRANSLATE_API_KEY=` 
   - Google Translate API key'i ekleyebilirsiniz

---

## 🐳 Docker ile Başlatma (ÖNERİLEN)

### 1. Docker Container'ları Başlat
```bash
cd document-translation-system
docker-compose up -d
```

### 2. Logları İzle (İsteğe Bağlı)
```bash
docker-compose logs -f backend
```

### 3. Database Migration'ları Çalıştır
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### 4. Superuser Oluştur
```bash
docker-compose exec backend python manage.py createsuperuser
```

**Bilgileri girin:**
- Username: admin
- Email: admin@example.com
- Password: (güçlü bir şifre)

### 5. Static Files Topla
```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

---

## ✅ Test Et

### Admin Panel
```
http://localhost:8000/admin
```
- Superuser bilgileriyle giriş yapın

### API Documentation
```
http://localhost:8000/api/docs/
```
- Swagger UI ile API'yi keşfedin

### API Root
```
http://localhost:8000/api/
```
- Tüm endpoint'leri görün

### Health Check
```
http://localhost:8000/api/health/
```
- Sistem sağlığını kontrol edin

---

## 🛑 Durdurma

```bash
# Container'ları durdur
docker-compose stop

# Container'ları durdur ve sil
docker-compose down

# Container'ları, volume'leri ve network'leri sil
docker-compose down -v
```

---

## 🔄 Yeniden Başlatma

```bash
# Container'ları yeniden başlat
docker-compose restart

# Sadece backend'i yeniden başlat
docker-compose restart backend
```

---

## 📊 Container Durumunu Kontrol Et

```bash
# Çalışan container'ları göster
docker-compose ps

# Tüm container'ların loglarını göster
docker-compose logs

# Sadece backend loglarını göster
docker-compose logs backend

# Canlı log takibi
docker-compose logs -f backend
```

---

## 🐛 Sorun Giderme

### Port Zaten Kullanılıyor
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

# Veya database'i tamamen sıfırla
docker-compose down -v
docker-compose up -d
docker-compose exec backend python manage.py migrate
```

### Container Build Hataları
```bash
# Container'ları yeniden build et
docker-compose build --no-cache

# Sonra başlat
docker-compose up -d
```

---

## 📝 Yararlı Komutlar

### Backend Container'a Gir
```bash
docker-compose exec backend bash
```

### Database'e Bağlan
```bash
docker-compose exec db psql -U postgres -d document_translation_db
```

### Redis'e Bağlan
```bash
docker-compose exec redis redis-cli
```

### Django Shell
```bash
docker-compose exec backend python manage.py shell
```

### Test Kullanıcısı Oluştur
```bash
docker-compose exec backend python manage.py shell
```
```python
from apps.authentication.models import User
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='testpass123',
    role='user'
)
```

---

## 🎯 Sonraki Adımlar

1. ✅ Admin panel'de modelleri keşfedin
2. ✅ API dokümantasyonunu inceleyin
3. ✅ Test kullanıcıları oluşturun
4. ✅ API endpoint'lerini test edin
5. ⏳ Frontend geliştirmeye başlayın

---

## 📚 Daha Fazla Bilgi

- **QUICK_START.md** - Hızlı başlangıç rehberi
- **TESTING_GUIDE.md** - Test rehberi
- **SETUP_GUIDE.md** - Detaylı kurulum
- **PROJECT_COMPLETION_REPORT.md** - Proje raporu
- **DEPLOYMENT_GUIDE_EROXAI.md** - Production deployment

---

## 🎉 Başarılar!

Projeniz hazır! Docker container'ları çalışıyor ve sistem kullanıma hazır.

**Admin Panel:** http://localhost:8000/admin  
**API Docs:** http://localhost:8000/api/docs/  
**API Root:** http://localhost:8000/api/
