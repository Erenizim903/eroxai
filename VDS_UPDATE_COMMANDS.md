# 🚀 VDS Güncelleme Komutları - EroxAI

Bu dosya, VDS'te yapılan değişiklikleri güncellemek için kullanılacak komutları içerir.

## 📋 Hızlı Güncelleme (Tek Komut)

### Yöntem 1: Update Script Kullanarak
```bash
cd /var/www/document-translation-system
bash update_vds.sh
```

### Yöntem 2: Manuel Adımlar (Tek Tek)

```bash
# 1. Proje dizinine git
cd /var/www/document-translation-system

# 2. Git'ten son değişiklikleri çek
git pull origin main

# 3. Frontend build et
cd frontend
npm install
npm run build

# 4. Backend'i yeniden başlat (eğer backend değişikliği varsa)
cd ../backend
source ../venv/bin/activate
python3 manage.py collectstatic --noinput
systemctl restart eroxai

# 5. Nginx'i yeniden başlat
systemctl restart nginx

# 6. Durum kontrolü
systemctl status eroxai nginx
```

## 🔍 Güncelleme Sonrası Kontrol

### Servis Durumu Kontrolü
```bash
# Backend durumu
systemctl status eroxai

# Nginx durumu
systemctl status nginx

# Son 50 satır logları
journalctl -u eroxai -n 50 --no-pager
```

### Frontend Build Kontrolü
```bash
# Build dosyalarının varlığını kontrol et
ls -lh /var/www/document-translation-system/frontend/dist/

# Build dosyalarının boyutunu kontrol et (boş olmamalı)
du -sh /var/www/document-translation-system/frontend/dist/
```

### Site Erişim Kontrolü
```bash
# Site'nin çalışıp çalışmadığını kontrol et
curl -I https://eroxai.org

# Backend API'yi kontrol et
curl -I https://eroxai.org/api/site-settings/
```

## 🐛 Sorun Giderme

### Git Pull Hatası
```bash
# Değişiklikler varsa stash yap
git stash
git pull origin main
git stash pop
```

### Frontend Build Hatası
```bash
# Node modules'ü temizle ve yeniden kur
cd /var/www/document-translation-system/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Backend Hatası
```bash
# Backend loglarını kontrol et
journalctl -u eroxai -n 100 --no-pager

# Virtual environment'i kontrol et
source /var/www/document-translation-system/venv/bin/activate
python3 --version
pip list | grep -i django
```

### Nginx Hatası
```bash
# Nginx config test
nginx -t

# Nginx loglarını kontrol et
tail -f /var/log/nginx/error.log
```

## 📝 Notlar

- **Her güncellemeden önce**: Git'ten çekmeyi unutmayın
- **Frontend değişikliği varsa**: Mutlaka `npm run build` yapın
- **Backend değişikliği varsa**: `collectstatic` ve `restart` yapın
- **Yeni paket eklendiyse**: `npm install` veya `pip install` yapın

## 🔐 Güvenlik

- Güncelleme sırasında site birkaç saniye erişilemeyebilir
- Kritik işlemlerde maintenance mode açabilirsiniz
- Yedek almayı unutmayın: `git commit -am "Backup before update"`
