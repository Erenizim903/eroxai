# 🚀 Hosting Deployment Guide - eroxai.org

Bu rehber, projeyi herhangi bir hosting'e (VPS, Cloud Server) tek komutla yüklemeniz için hazırlanmıştır.

---

## 📋 Gereksinimler

### Hosting Gereksinimleri
- **OS:** Ubuntu 20.04+ / Debian 11+
- **RAM:** Minimum 2GB (Önerilen 4GB)
- **Disk:** Minimum 20GB
- **CPU:** 2 Core+
- **Domain:** eroxai.org (DNS ayarları yapılmış)

### Kurulu Olması Gerekenler
- Docker
- Docker Compose
- Git

---

## 🎯 Tek Komut Kurulum

### 1. Sunucuya Bağlanın
```bash
ssh root@your-server-ip
```

### 2. Kurulum Scriptini Çalıştırın
```bash
curl -sSL https://raw.githubusercontent.com/your-repo/document-translation-system/main/deploy.sh | bash
```

**VEYA** Manuel kurulum:

```bash
# 1. Projeyi klonlayın
git clone https://github.com/your-repo/document-translation-system.git
cd document-translation-system

# 2. Kurulum scriptini çalıştırın
chmod +x deploy.sh
./deploy.sh
```

---

## 📝 deploy.sh Script İçeriği

Script otomatik olarak:
1. ✅ Docker ve Docker Compose kurulumunu kontrol eder
2. ✅ Gerekli portları açar (80, 443, 8000)
3. ✅ SSL sertifikası oluşturur (Let's Encrypt)
4. ✅ .env dosyasını yapılandırır
5. ✅ Database'i başlatır
6. ✅ Migration'ları çalıştırır
7. ✅ Static dosyaları toplar
8. ✅ Tüm servisleri başlatır

---

## 🔧 Manuel Kurulum Adımları

### Adım 1: Docker Kurulumu
```bash
# Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose kurulumu
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Adım 2: Projeyi Klonlayın
```bash
cd /var/www
git clone https://github.com/your-repo/document-translation-system.git
cd document-translation-system
```

### Adım 3: Environment Ayarları
```bash
# .env dosyası zaten hazır (API key'ler dahil)
# Sadece domain'i güncelleyin
sed -i 's/localhost/eroxai.org/g' .env
sed -i 's/127.0.0.1/eroxai.org/g' .env
```

### Adım 4: SSL Sertifikası (Let's Encrypt)
```bash
# Certbot kurulumu
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# SSL sertifikası oluşturma
sudo certbot --nginx -d eroxai.org -d www.eroxai.org
```

### Adım 5: Docker Compose ile Başlatma
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d --build

# Logları kontrol edin
docker-compose -f docker-compose.prod.yml logs -f
```

### Adım 6: Database Migration
```bash
# Migration'ları çalıştırın
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Superuser oluşturun
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Static dosyaları toplayın
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

---

## 🌐 DNS Ayarları

eroxai.org için DNS kayıtları:

```
Type    Name    Value               TTL
A       @       YOUR_SERVER_IP      3600
A       www     YOUR_SERVER_IP      3600
CNAME   api     eroxai.org          3600
```

---

## 🔒 Güvenlik Ayarları

### Firewall Kuralları
```bash
# UFW kurulumu
sudo apt-get install -y ufw

# Port ayarları
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Fail2Ban (Brute Force Koruması)
```bash
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 Servis Durumu Kontrolü

```bash
# Tüm servislerin durumunu kontrol edin
docker-compose -f docker-compose.prod.yml ps

# Logları görüntüleyin
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Servis sağlığını kontrol edin
curl http://localhost:8000/api/health/
curl http://localhost:3000/
```

---

## 🔄 Güncelleme

```bash
# Yeni kodu çekin
git pull origin main

# Servisleri yeniden başlatın
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Migration'ları çalıştırın
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

---

## 💾 Yedekleme

### Otomatik Yedekleme Scripti
```bash
# /root/backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/document-translation"

mkdir -p $BACKUP_DIR

# Database backup
docker-compose -f /var/www/document-translation-system/docker-compose.prod.yml exec -T db pg_dump -U postgres document_translation_db > $BACKUP_DIR/db_$DATE.sql

# Media files backup
tar -czf $BACKUP_DIR/media_$DATE.tar.gz /var/www/document-translation-system/backend/media

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

### Cron Job Ekleyin
```bash
# Günlük 3:00'da yedekleme
crontab -e
0 3 * * * /root/backup.sh
```

---

## 🎯 Performans Optimizasyonu

### 1. Nginx Caching
```nginx
# /etc/nginx/conf.d/cache.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
proxy_cache_key "$scheme$request_method$host$request_uri";
```

### 2. Redis Memory Limit
```bash
# docker-compose.prod.yml içinde
redis:
  command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

### 3. PostgreSQL Tuning
```bash
# Shared buffers artırın
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -c "ALTER SYSTEM SET shared_buffers = '256MB';"
docker-compose -f docker-compose.prod.yml restart db
```

---

## 📱 Monitoring

### 1. Uptime Monitoring
```bash
# Healthcheck endpoint
curl https://eroxai.org/api/health/
```

### 2. Log Monitoring
```bash
# Real-time logs
docker-compose -f docker-compose.prod.yml logs -f --tail=100

# Error logs
docker-compose -f docker-compose.prod.yml logs | grep ERROR
```

### 3. Resource Usage
```bash
# Container resource usage
docker stats

# Disk usage
df -h

# Memory usage
free -h
```

---

## 🆘 Sorun Giderme

### Problem: Servisler başlamıyor
```bash
# Logları kontrol edin
docker-compose -f docker-compose.prod.yml logs

# Servisleri yeniden başlatın
docker-compose -f docker-compose.prod.yml restart
```

### Problem: Database bağlantı hatası
```bash
# Database durumunu kontrol edin
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -c "SELECT 1;"

# Database'i yeniden başlatın
docker-compose -f docker-compose.prod.yml restart db
```

### Problem: Static dosyalar yüklenmiyor
```bash
# Static dosyaları yeniden toplayın
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

# Nginx'i yeniden başlatın
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 📞 Destek

- **Email:** support@eroxai.org
- **Documentation:** https://eroxai.org/docs
- **GitHub Issues:** https://github.com/your-repo/issues

---

## ✅ Kurulum Sonrası Kontrol Listesi

- [ ] Tüm servisler çalışıyor
- [ ] SSL sertifikası aktif
- [ ] Database migration'ları tamamlandı
- [ ] Admin paneline erişim sağlandı
- [ ] API endpoint'leri çalışıyor
- [ ] Frontend yükleniyor
- [ ] OCR testi yapıldı
- [ ] Translation testi yapıldı
- [ ] Yedekleme scripti kuruldu
- [ ] Monitoring aktif
- [ ] Firewall kuralları ayarlandı

---

## 🎉 Başarılı Kurulum!

Projeniz şu adreslerde yayında:
- **Frontend:** https://eroxai.org
- **Backend API:** https://eroxai.org/api
- **Admin Panel:** https://eroxai.org/admin

**Tebrikler! Sistem kullanıma hazır! 🚀**
