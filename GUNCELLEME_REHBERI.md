# 🚀 EroxAI Studio Güncelleme Rehberi

Bu rehber, Windows'tan VDS'e güncelleme yapmak için hazırlanmıştır.

## 📋 Hazır Batch Dosyaları

### 1. `update.bat` - **İnteraktif Güncelleme (Önerilen)**
En kapsamlı ve kullanıcı dostu güncelleme scripti.

**Kullanım:**
```batch
update.bat
```

**Özellikler:**
- ✅ Git pull yapar
- ✅ Frontend build eder
- ✅ VDS güncellemesi için 3 seçenek sunar:
  - SSH ile otomatik güncelleme
  - Manuel komutları gösterir
  - Sadece yerel güncelleme

---

### 2. `update-simple.bat` - **Basit Güncelleme**
Sadece yerel (Windows) güncelleme yapar, VDS'e bağlanmaz.

**Kullanım:**
```batch
update-simple.bat
```

**Ne Yapar:**
- ✅ Git pull
- ✅ Frontend build

**Sonra:** VDS'e manuel olarak SSH ile bağlanıp güncelleme yaparsınız.

---

### 4. `update-vds.bat` - **Sadece VDS Güncelleme (SSH Anahtarı Gerekli)**
Windows'tan direkt VDS'e SSH ile bağlanıp güncelleme yapar.

**Kullanım:**
```batch
update-vds.bat
```

**Gereksinimler:**
- SSH anahtarları yapılandırılmış olmalı (şifresiz giriş)
- VDS IP adresi

**Not:** SSH anahtarı yoksa `update-easy.bat` kullanın!

---

## 🎯 Hızlı Başlangıç

### Senaryo 1: En Kolay Yöntem (SSH anahtarı yoksa) ⭐ ÖNERİLEN
```batch
update-easy.bat
```
Sonra VDS'e SSH ile bağlanıp: `bash update_vds.sh`

### Senaryo 2: Her Şeyi Otomatik (SSH anahtarı varsa)
```batch
update.bat
```
Sonra seçeneklerden **1** seçin (SSH ile otomatik).

### Senaryo 3: Sadece Yerel (Windows) Güncelleme
```batch
update-simple.bat
```

### Senaryo 4: Sadece VDS Güncelleme (SSH anahtarı varsa)
```batch
update-vds.bat
```

---

## 📝 Adım Adım Kullanım

### `update.bat` Detaylı Kullanım

1. **Dosyayı Çift Tıklayın** veya CMD'de çalıştırın:
   ```batch
   update.bat
   ```

2. **Git durumu** gösterilir ve pull yapılır.

3. **Frontend build** otomatik yapılır.

4. **VDS seçeneği** sorulur:
   - **1** → SSH ile otomatik (IP ve kullanıcı adı sorar)
   - **2** → Manuel komutları gösterir
   - **3** → VDS'i atla, sadece yerel güncelleme

---

## 🔧 SSH Yapılandırması (VDS için)

### Windows'ta SSH Anahtarı Oluşturma

```powershell
# PowerShell'de çalıştırın
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

### VDS'e SSH Anahtarı Kopyalama

```powershell
# Windows'tan VDS'e anahtarı kopyala
ssh-copy-id root@89.47.113.42
```

Veya manuel:
```batch
type %USERPROFILE%\.ssh\id_rsa.pub | ssh root@89.47.113.42 "cat >> ~/.ssh/authorized_keys"
```

### Test
```batch
ssh root@89.47.113.42 "echo 'SSH bağlantısı başarılı!'"
```

---

## 🐛 Sorun Giderme

### Git Pull Hatası
```batch
# Yerel değişiklikleri stash yap
git stash
git pull origin main
git stash pop
```

### Frontend Build Hatası
```batch
# Node modules'ü temizle
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
npm run build
```

### SSH Bağlantı Hatası
- SSH anahtarlarınızın yapılandırıldığından emin olun
- VDS IP adresinin doğru olduğundan emin olun
- Firewall'da SSH portunun (22) açık olduğundan emin olun

---

## 📊 Güncelleme Sonrası Kontrol

### VDS'te Kontrol
```bash
# Servis durumu
systemctl status eroxai nginx

# Build dosyaları
ls -lh /var/www/document-translation-system/frontend/dist/
```

### Windows'ta Kontrol
```batch
# Build klasörü kontrolü
dir frontend\dist
```

---

## 💡 İpuçları

1. **İlk kullanımda:** `update.bat` kullanın, en güvenli ve kullanıcı dostu
2. **SSH yapılandırılmışsa:** `update-vds.bat` en hızlı
3. **Sadece kod değişikliği:** `update-simple.bat` yeterli
4. **Her zaman:** Önce yerel test edin, sonra VDS'e güncelleyin

---

## 🔄 Güncelleme Akışı

```
Windows (Geliştirme)
    ↓
Git Commit & Push
    ↓
update.bat Çalıştır
    ↓
Git Pull (Yerel)
    ↓
Frontend Build
    ↓
SSH ile VDS'e Bağlan
    ↓
Git Pull (VDS)
    ↓
Frontend Build (VDS)
    ↓
Backend Restart
    ↓
Nginx Restart
    ↓
✅ Site Güncel!
```

---

## 📞 Destek

Sorun yaşarsanız:
1. Hata mesajını kaydedin
2. `systemctl status eroxai` çıktısını kontrol edin
3. Logları kontrol edin: `journalctl -u eroxai -n 50`
