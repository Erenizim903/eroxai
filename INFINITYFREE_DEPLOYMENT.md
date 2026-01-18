# 🌐 InfinityFree Deployment Guide (Static Frontend)

## ✅ Özet

InfinityFree **statik hosting** sağlar. Bu proje **backend gerektirmeden** çalışacak şekilde hazırlandı:
- ✅ OCR (Tesseract.js) tarayıcıda çalışır
- ✅ Çeviri LibreTranslate ile istemci tarafında yapılır
- ✅ Sunucu kurulumu gerekmez

> Not: Google Vision veya OpenAI anahtarları **frontend’e gömülemez**.  
> InfinityFree üzerinde gizli anahtar saklama yöntemi yoktur.

---

## 📦 Adım Adım Kurulum

### ADIM 1: Frontend Build

```bash
cd frontend
npm install
npm run build
```

Build çıktısı: `frontend/dist`

---

### ADIM 2: InfinityFree’ye Yükleyin

#### A) File Manager ile (Önerilir)
1. InfinityFree Control Panel → File Manager  
2. `htdocs/` klasörüne gir  
3. `frontend/dist/` içindeki **tüm dosyaları** yükle  
   - `index.html`
   - `assets/`
   - `_redirects`
   - `.htaccess`

#### B) FTP ile
```
FTP Host: ftpupload.net
FTP Username: if0_XXXXXXX
FTP Password: (InfinityFree panelinden)
Port: 21
```

---

## 🌍 Domain Ayarları (eroxai.org)

### A) InfinityFree’de Domain Ekle
1. Control Panel → Addon Domains  
2. `eroxai.org` ekle  
3. Document Root: `htdocs/`

### B) DNS Ayarları (Domain sağlayıcında)
```
Type    Name   Value                           TTL
A       @      185.27.134.11 (InfinityFree IP)  3600
A       www    185.27.134.11                   3600
```

> InfinityFree IP değişebilir. Control Panel’den kontrol et.

---

## 🧩 SPA Yönlendirmesi (Zorunlu)

Bu projede SPA routing var. `frontend/public/.htaccess` ve `frontend/public/_redirects`
hazırdır ve build ile `dist` içine otomatik eklenir.

---

## 🔧 Sorun Giderme

### Problem: `/workspace` 404 veriyor
**Çözüm:** `htdocs/.htaccess` ve `_redirects` dosyalarının yüklendiğini doğrula.

### Problem: OCR/Çeviri çalışmıyor
**Çözüm:** HTTPS açık olmalı, tarayıcı izinlerini kontrol et.

---

## ✅ Tamamlandı

Yükleme bittiğinde:
- `https://eroxai.org` çalışır
- `https://eroxai.org/workspace` çalışır

Ek backend istersen (Google Vision / OpenAI):
InfinityFree bunu barındıramaz. Ayrı bir backend gerekir.
