# 🚀 BAŞTAN SONA KURULUM REHBERİ

## 📌 ÖNEMLİ: Bu rehberi takip edin, hiçbir şey atlamayın!

---

## 🎯 ADIM 1: HAZIRLIK (5 dakika)

### 1.1 Node.js Kurulumu
```
1. https://nodejs.org adresine git
2. "LTS" versiyonunu indir (yeşil buton)
3. İndirilen dosyayı çalıştır
4. "Next, Next, Next" diyerek kur
5. Bilgisayarı yeniden başlat
```

**Kontrol et:**
```cmd
Windows + R → cmd → Enter
node --version
npm --version
```
Versiyon numaraları görünüyorsa ✅ tamam!

### 1.2 Git Kurulumu
```
1. https://git-scm.com adresine git
2. "Download for Windows" butonuna tıkla
3. İndirilen dosyayı çalıştır
4. Tüm ayarları varsayılan bırak, "Next" diyerek kur
5. Bilgisayarı yeniden başlat
```

**Kontrol et:**
```cmd
Windows + R → cmd → Enter
git --version
```
Versiyon numarası görünüyorsa ✅ tamam!

---

## 🎯 ADIM 2: GITHUB HESABI (2 dakika)

### 2.1 GitHub'a Kaydol
```
1. https://github.com/signup adresine git
2. Email adresini gir
3. Şifre oluştur
4. Kullanıcı adı seç
5. Email'ini doğrula
6. ✅ Hesap hazır!
```

### 2.2 Yeni Repository Oluştur
```
1. https://github.com/new adresine git
2. Repository name: document-translation
3. Public seç
4. "Create repository" butonuna tıkla
5. Açılan sayfada URL'yi kopyala (örn: https://github.com/USERNAME/document-translation.git)
6. ✅ Repository hazır!
```

**ÖNEMLİ:** Bu URL'yi bir yere not et! İhtiyacın olacak.

---

## 🎯 ADIM 3: RAILWAY HESABI (3 dakika)

### 3.1 Railway'e Kaydol
```
1. https://railway.app adresine git
2. "Login with GitHub" butonuna tıkla
3. GitHub hesabınla giriş yap
4. Railway'e izin ver
5. ✅ Hesap hazır!
```

### 3.2 Backend Projesi Oluştur

**YÖN TEM 1: Empty Project (KOLAY - ÖNERİLEN)**
```
1. Railway dashboard'da "New Project" butonuna tıkla
2. "Empty Project" seç
3. Proje adı: document-translation
4. "Create" tıkla
5. ✅ Boş proje oluşturuldu!
```

**YÖNTEM 2: GitHub'dan Deploy (Alternatif)**
```
Eğer "Deploy from GitHub repo" seçeneği varsa:
1. "Deploy from GitHub repo" seç
2. "Configure GitHub App" tıkla
3. Repository'ni seç
4. "Deploy Now" tıkla

Not: Bu seçenek çıkmıyorsa YÖNTEM 1'i kullan!
```

### 3.3 PostgreSQL Ekle
```
1. Proje sayfasında "+ New" butonuna tıkla
2. "Database" seç
3. "Add PostgreSQL" tıkla
4. ✅ PostgreSQL eklendi!
```

### 3.4 Redis Ekle
```
1. Proje sayfasında "+ New" butonuna tıkla
2. "Database" seç
3. "Add Redis" tıkla
4. ✅ Redis eklendi!
```

### 3.5 GitHub Repository'yi Bağla
```
1. Proje sayfasında "+ New" butonuna tıkla
2. "GitHub Repo" seç
3. "Configure GitHub App" tıkla
4. Açılan pencerede:
   - "Only select repositories" seç
   - "Select repositories" dropdown'dan "document-translation" seç
   - "Install & Authorize" tıkla
5. Railway'e geri dön
6. "document-translation" repository'sini seç
7. "Add Service" tıkla
8. ✅ Repository bağlandı!
```

**Not:** Eğer repository listede görünmüyorsa:
```
1. GitHub'a git: https://github.com/settings/installations
2. Railway'i bul
3. "Configure" tıkla
4. "Repository access" → "All repositories" seç
5. "Save" tıkla
6. Railway'e geri dön ve tekrar dene
```

### 3.6 Environment Variables Ekle
```
1. GitHub Repo servisine tıkla (방금 eklediğin)
2. "Variables" sekmesine git
3. "RAW Editor" butonuna tıkla
4. Şu metni yapıştır:

SECRET_KEY=django-insecure-your-secret-key-12345
DEBUG=False
ALLOWED_HOSTS=.railway.app
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
OPENAI_API_KEY=your-openai-key-here
GOOGLE_VISION_API_KEY=your-google-vision-key-here
USE_GOOGLE_VISION=true
CORS_ALLOWED_ORIGINS=https://eroxai.org,https://www.eroxai.org
PORT=8000

5. "Update Variables" tıkla
6. Otomatik deploy başlayacak
7. Deployment tamamlanana kadar bekle (3-5 dakika)
```

### 3.7 Backend URL'ini Al
```
1. GitHub Repo servisine tıkla
2. "Settings" sekmesine git
3. "Networking" bölümüne git
4. "Generate Domain" butonuna tıkla
5. Oluşan URL'yi kopyala
   Örnek: https://document-translation-production.up.railway.app
6. ✅ Bu URL'yi not et! İhtiyacın olacak.
```

**Deployment Kontrolü:**
```
1. "Deployments" sekmesine git
2. En son deployment'ın durumunu kontrol et
3. "Success" yazıyorsa ✅ tamam!
4. "Failed" yazıyorsa:
   - "View Logs" tıkla
   - Hatayı oku
   - Environment variables'ı kontrol et
```

---

## 🎯 ADIM 4: INFINITYFREE HESABI (3 dakika)

### 4.1 InfinityFree'ye Kaydol
```
1. https://infinityfree.net adresine git
2. "Sign Up" butonuna tıkla
3. Email adresini gir
4. Şifre oluştur
5. Email'ini doğrula
6. ✅ Hesap hazır!
```

### 4.2 Hosting Oluştur
```
1. Control Panel'e gir
2. "Create Account" butonuna tıkla
3. Domain seç:
   - Subdomain kullan: eroxai.infinityfreeapp.com
   VEYA
   - Kendi domain'ini ekle: eroxai.org
4. "Create Account" tıkla
5. ✅ Hosting hazır!
```

---

## 🎯 ADIM 5: PROJEYI HAZIRLA (5 dakika)

### 5.1 CMD'yi Aç
```
1. Windows tuşuna bas
2. "cmd" yaz
3. Enter'a bas
```

### 5.2 Proje Klasörüne Git
```cmd
cd C:\Users\eren\Desktop\document-translation-system
```

### 5.3 Deployment Script'ini Çalıştır
```cmd
deploy-infinityfree.bat
```

### 5.4 Soruları Cevapla

**Soru 1:** GitHub repository URL'nizi girin
```
Cevap: https://github.com/USERNAME/document-translation.git
(ADIM 2.2'de not ettiğin URL)
```

**Soru 2:** Railway backend URL'nizi girin
```
Cevap: https://document-translation-production.up.railway.app
(ADIM 3.6'da not ettiğin URL)
```

### 5.5 Script Tamamlanana Kadar Bekle
```
Script şunları yapacak:
- GitHub'a yükleyecek
- Frontend build alacak
- .htaccess oluşturacak
- ZIP dosyası hazırlayacak

Süre: 3-5 dakika
```

**✅ Script tamamlandığında:**
- `frontend\infinityfree-upload.zip` dosyası oluşacak
- Bu dosyayı kullanacağız!

---

## 🎯 ADIM 6: INFINITYFREE'YE YÜKLE (5 dakika)

### Yöntem 1: File Manager (KOLAY - ÖNERİLEN)

#### 6.1 File Manager'ı Aç
```
1. InfinityFree Control Panel'e git
2. "File Manager" butonuna tıkla
3. Yeni sekmede açılacak
```

#### 6.2 htdocs Klasörüne Git
```
1. Sol tarafta "htdocs" klasörüne çift tıkla
2. İçindeki TÜM dosyaları sil (varsa)
   - Tümünü seç → Sağ tık → Delete
```

#### 6.3 ZIP Dosyasını Yükle
```
1. "Upload" butonuna tıkla
2. "Select File" tıkla
3. Şu dosyayı seç:
   C:\Users\eren\Desktop\document-translation-system\frontend\infinityfree-upload.zip
4. "Upload" tıkla
5. Yükleme tamamlanana kadar bekle (1-2 dakika)
```

#### 6.4 ZIP'i Extract Et
```
1. infinityfree-upload.zip dosyasına sağ tıkla
2. "Extract" seç
3. Extract tamamlanana kadar bekle (30 saniye)
4. ZIP dosyasını sil (sağ tık → Delete)
```

#### 6.5 Dosyaları Kontrol Et
```
htdocs/ klasöründe şunlar olmalı:
- index.html
- assets/ klasörü
- .htaccess
- vite.svg
- favicon.ico

✅ Varsa tamam!
```

---

### Yöntem 2: FTP (ALTERNATİF)

#### 6.1 FileZilla İndir
```
1. https://filezilla-project.org adresine git
2. "Download FileZilla Client" tıkla
3. İndir ve kur
```

#### 6.2 FTP Bilgilerini Al
```
1. InfinityFree Control Panel'e git
2. "FTP Details" butonuna tıkla
3. Şu bilgileri not et:
   - FTP Hostname: ftpupload.net
   - FTP Username: if0_XXXXXXX
   - FTP Password: (göster butonuna tıkla)
```

#### 6.3 FileZilla ile Bağlan
```
1. FileZilla'yı aç
2. Üstteki kutulara gir:
   Host: ftpupload.net
   Username: if0_XXXXXXX
   Password: (kopyaladığın şifre)
   Port: 21
3. "Quickconnect" tıkla
```

#### 6.4 Dosyaları Yükle
```
1. Sol taraf (Local): 
   C:\Users\eren\Desktop\document-translation-system\frontend\dist\
2. Sağ taraf (Remote):
   /htdocs/
3. Sol taraftaki TÜM dosyaları seç
4. Sağ tarafa sürükle-bırak
5. Yükleme tamamlanana kadar bekle (2-3 dakika)
```

---

## 🎯 ADIM 7: DOMAIN AYARLARI (2 dakika)

### 7.1 InfinityFree'de Domain Ekle

#### Eğer Subdomain Kullanıyorsan:
```
✅ Zaten hazır! Bir şey yapman gerekmiyor.
Site: https://eroxai.infinityfreeapp.com
```

#### Eğer Kendi Domain'in Varsa (eroxai.org):
```
1. InfinityFree Control Panel → "Addon Domains"
2. "Add Domain" tıkla
3. Domain: eroxai.org
4. "Add Domain" tıkla
```

### 7.2 DNS Ayarları (Sadece Kendi Domain İçin)

#### Domain Sağlayıcında (Namecheap, GoDaddy vb.):
```
1. Domain yönetim paneline git
2. DNS ayarlarına git
3. Şu kayıtları ekle:

Type    Name    Value               TTL
A       @       185.27.134.11       3600
A       www     185.27.134.11       3600

4. Kaydet
5. 24 saat bekle (genelde 1-2 saat yeter)
```

**Not:** InfinityFree IP adresi değişebilir, Control Panel'den kontrol et!

---

## 🎯 ADIM 8: TEST ET! (2 dakika)

### 8.1 Frontend Test
```
1. Tarayıcıyı aç
2. Şu adrese git:
   - Subdomain: https://eroxai.infinityfreeapp.com
   - Domain: https://eroxai.org
3. Site açılıyor mu? ✅
```

### 8.2 Backend Test
```
1. Tarayıcıyı aç
2. Railway backend URL'ine git:
   https://your-app.railway.app/api/
3. API çalışıyor mu? ✅
```

### 8.3 Admin Panel Test
```
1. Railway dashboard'a git
2. Backend servisine tıkla
3. "Console" sekmesine git
4. Şu komutu çalıştır:
   python manage.py createsuperuser
5. Username, email, password gir
6. Tarayıcıda aç:
   https://your-app.railway.app/admin/
7. Giriş yap ✅
```

---

## 🎉 TAMAMLANDI!

### ✅ Siteniz Yayında:
- **Frontend:** https://eroxai.org (veya subdomain)
- **Backend API:** https://your-app.railway.app/api/
- **Admin Panel:** https://your-app.railway.app/admin/

### 📊 Özet:
- ✅ Backend Railway'de çalışıyor
- ✅ Frontend InfinityFree'de yayında
- ✅ OCR ve Translation hazır
- ✅ Tamamen ücretsiz!

---

## 🆘 SORUN ÇÖZME

### Problem: "Node.js bulunamadı"
```
Çözüm:
1. Node.js'i kur (ADIM 1.1)
2. Bilgisayarı yeniden başlat
3. CMD'yi kapat ve tekrar aç
4. Script'i tekrar çalıştır
```

### Problem: "Git bulunamadı"
```
Çözüm:
1. Git'i kur (ADIM 1.2)
2. Bilgisayarı yeniden başlat
3. CMD'yi kapat ve tekrar aç
4. Script'i tekrar çalıştır
```

### Problem: "Build hatası"
```
Çözüm:
cd frontend
npm install
npm run build
```

### Problem: "Site açılmıyor"
```
Çözüm:
1. InfinityFree File Manager'da dosyaları kontrol et
2. htdocs/ içinde index.html var mı?
3. .htaccess var mı?
4. Yoksa ADIM 6'yı tekrarla
```

### Problem: "API çalışmıyor"
```
Çözüm:
1. Railway dashboard'a git
2. Backend servisinin "Logs" sekmesine bak
3. Hata varsa environment variables'ı kontrol et
4. Redeploy et
```

---

## 📞 YARDIM

Hala sorun mu var?

1. **WINDOWS_DEPLOYMENT.md** dosyasına bak
2. **INFINITYFREE_DEPLOYMENT.md** dosyasına bak
3. Script çıktısını oku
4. Error mesajlarını Google'da ara

---

## 🎯 ÖNEMLİ NOTLAR

1. **Railway Free Tier:** 500 saat/ay ücretsiz (yeterli)
2. **InfinityFree:** Tamamen ücretsiz, sınırsız
3. **API Keys:** Zaten .env dosyasında
4. **SSL:** Otomatik (hem Railway hem InfinityFree)
5. **Domain:** İstersen sonra ekleyebilirsin

---

**BAŞARILAR! 🚀**

Artık eroxai.org için Document Translation System kullanıma hazır!
