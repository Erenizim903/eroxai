# 🪟 Windows CMD Deployment Guide

Windows'ta tek komutla deployment için rehber.

---

## 🚀 Hızlı Başlangıç

### 1. CMD'yi Açın
```cmd
Windows + R → cmd → Enter
```

### 2. Proje Klasörüne Gidin
```cmd
cd C:\Users\eren\Desktop\document-translation-system
```

### 3. Deployment Script'ini Çalıştırın
```cmd
deploy-infinityfree.bat
```

**İşte bu kadar!** Script otomatik olarak her şeyi yapacak.

---

## 📋 Script Ne Yapar?

### Otomatik Adımlar:
1. ✅ Node.js, npm, Git kontrolü
2. ✅ Git repository oluşturma
3. ✅ GitHub'a yükleme
4. ✅ Railway backend deployment talimatları
5. ✅ Frontend build alma
6. ✅ .htaccess oluşturma
7. ✅ ZIP dosyası hazırlama
8. ✅ InfinityFree upload talimatları
9. ✅ Domain ayarları talimatları

---

## 🔧 Gereksinimler

### Yüklü Olması Gerekenler:
- ✅ Node.js 18+ → https://nodejs.org
- ✅ Git → https://git-scm.com
- ✅ PowerShell (Windows'ta varsayılan)

### Kontrol Etmek İçin:
```cmd
node --version
npm --version
git --version
```

---

## 📝 Adım Adım Kullanım

### Adım 1: CMD'yi Aç
```cmd
# Windows tuşu + R
# "cmd" yaz
# Enter'a bas
```

### Adım 2: Proje Klasörüne Git
```cmd
cd Desktop\document-translation-system
```

### Adım 3: Script'i Çalıştır
```cmd
deploy-infinityfree.bat
```

### Adım 4: Soruları Cevapla

**Soru 1:** GitHub repository URL'nizi girin
```
Cevap: https://github.com/YOUR_USERNAME/document-translation.git
```

**Soru 2:** Railway backend URL'nizi girin
```
Cevap: https://your-app.railway.app
```

### Adım 5: Bekleyin
Script otomatik olarak:
- Frontend build alacak
- .htaccess oluşturacak
- ZIP dosyası hazırlayacak

---

## 📤 InfinityFree'ye Yükleme

Script tamamlandıktan sonra:

### Yöntem 1: File Manager (Kolay)
```
1. https://infinityfree.net → Giriş yap
2. Control Panel → File Manager
3. htdocs/ klasörüne git
4. Upload → frontend\infinityfree-upload.zip seç
5. ZIP'e sağ tık → Extract
6. ZIP'i sil
7. Tamamlandı!
```

### Yöntem 2: FTP (FileZilla)
```
1. FileZilla indir: https://filezilla-project.org
2. Bağlan:
   Host: ftpupload.net
   Username: if0_XXXXXXX (InfinityFree'den)
   Password: (InfinityFree'den)
   Port: 21
3. Sol taraf: frontend\dist\
4. Sağ taraf: htdocs/
5. Tüm dosyaları sürükle-bırak
6. Tamamlandı!
```

---

## 🌐 Domain Ayarları

### InfinityFree'de:
```
1. Control Panel → Addon Domains
2. "eroxai.org" ekle
3. Document Root: htdocs/
```

### Domain Sağlayıcınızda:
```
DNS Kayıtları:

Type    Name    Value               TTL
A       @       185.27.134.11       3600
A       www     185.27.134.11       3600
```

**Not:** InfinityFree IP'sini Control Panel'den kontrol edin!

---

## 🚂 Railway Backend

### Railway'de Backend Deploy:
```
1. https://railway.app → GitHub ile giriş
2. "New Project" → "Deploy from GitHub"
3. Repository'nizi seçin
4. "backend" klasörünü root olarak ayarlayın
5. "Add Service" → PostgreSQL
6. "Add Service" → Redis
7. "Variables" → .env dosyasındaki tüm değerleri ekleyin
8. Deploy!
```

### Environment Variables:
```
.env dosyasındaki tüm değerleri Railway'e ekleyin:
- OPENAI_API_KEY
- GOOGLE_VISION_API_KEY
- DATABASE_URL (otomatik)
- REDIS_URL (otomatik)
- vb.
```

---

## ❓ Sorun Giderme

### Problem: "Node.js bulunamadı"
**Çözüm:**
```
1. https://nodejs.org adresine git
2. LTS versiyonu indir
3. Kur
4. CMD'yi kapat ve tekrar aç
5. Script'i tekrar çalıştır
```

### Problem: "Git bulunamadı"
**Çözüm:**
```
1. https://git-scm.com adresine git
2. Windows versiyonunu indir
3. Kur (varsayılan ayarlarla)
4. CMD'yi kapat ve tekrar aç
5. Script'i tekrar çalıştır
```

### Problem: "Build hatası"
**Çözüm:**
```cmd
cd frontend
npm install
npm run build
```

### Problem: "ZIP oluşturulamadı"
**Çözüm:**
```
Manuel olarak:
1. frontend\dist\ klasörüne git
2. Tüm dosyaları seç
3. Sağ tık → "Sıkıştırılmış (zipped) klasöre gönder"
4. infinityfree-upload.zip olarak kaydet
```

---

## 📊 Deployment Checklist

### ✅ Hazırlık
- [ ] Node.js yüklü
- [ ] Git yüklü
- [ ] GitHub hesabı var
- [ ] Railway hesabı var
- [ ] InfinityFree hesabı var

### ✅ Script Çalıştırma
- [ ] CMD'de proje klasörüne gidildi
- [ ] deploy-infinityfree.bat çalıştırıldı
- [ ] GitHub URL girildi
- [ ] Railway URL girildi
- [ ] Build başarılı
- [ ] ZIP oluşturuldu

### ✅ Backend (Railway)
- [ ] Railway'de proje oluşturuldu
- [ ] PostgreSQL eklendi
- [ ] Redis eklendi
- [ ] Environment variables eklendi
- [ ] Deploy edildi
- [ ] URL alındı

### ✅ Frontend (InfinityFree)
- [ ] ZIP yüklendi
- [ ] Extract edildi
- [ ] Domain eklendi
- [ ] DNS ayarları yapıldı

### ✅ Test
- [ ] https://eroxai.org açılıyor
- [ ] Backend API çalışıyor
- [ ] Admin panel erişilebilir

---

## 🎯 Sonuç

Script çalıştırıldıktan sonra:

**Oluşturulan Dosyalar:**
- `frontend\dist\` - Build dosyaları
- `frontend\infinityfree-upload.zip` - Upload dosyası
- `frontend\.env` - Environment variables

**Siteniz:**
- Frontend: https://eroxai.org
- Backend: https://your-app.railway.app
- Admin: https://eroxai.org/admin

---

## 💡 İpuçları

1. **GitHub Private Repo:** Ücretsiz private repository kullanabilirsiniz
2. **Railway Free Tier:** 500 saat/ay ücretsiz
3. **InfinityFree:** Tamamen ücretsiz, reklamsız
4. **Domain:** eroxai.org'u InfinityFree'ye bağlayın
5. **SSL:** InfinityFree otomatik SSL sağlar

---

## 📞 Yardım

Sorun yaşarsanız:
1. INFINITYFREE_DEPLOYMENT.md dosyasına bakın
2. Script çıktısını kontrol edin
3. Error mesajlarını okuyun
4. Gerekirse adımları manuel yapın

---

**Başarılar! 🚀**
