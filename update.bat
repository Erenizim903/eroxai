@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   🚀 EroxAI Studio Güncelleme Scripti
echo ========================================
echo.

:: Renk kodları (PowerShell kullanarak)
powershell -Command "Write-Host '📂 Proje dizinine gidiliyor...' -ForegroundColor Cyan"

:: Mevcut dizini kontrol et
if not exist "frontend" (
    echo ❌ Hata: Frontend klasörü bulunamadı!
    echo 📍 Lütfen scripti proje kök dizininde çalıştırın.
    pause
    exit /b 1
)

:: 1. Git Status Kontrolü
echo.
echo ════════════════════════════════════════
echo   📥 Git Durumu Kontrol Ediliyor...
echo ════════════════════════════════════════
git status
echo.

:: Git pull yap
echo ════════════════════════════════════════
echo   🔄 Git'ten Son Değişiklikler Çekiliyor...
echo ════════════════════════════════════════
git pull origin main
if errorlevel 1 (
    echo.
    echo ⚠️  Git pull sırasında hata oluştu!
    echo 💡 Yerel değişiklikleriniz olabilir.
    echo.
    set /p continue="Devam etmek istiyor musunuz? (E/H): "
    if /i not "!continue!"=="E" exit /b 1
)
echo.

:: 2. Frontend Build
echo ════════════════════════════════════════
echo   🎨 Frontend Build Ediliyor...
echo ════════════════════════════════════════
cd frontend

echo.
echo 📦 NPM Paketleri Kontrol Ediliyor...
call npm install
if errorlevel 1 (
    echo.
    echo ❌ NPM install hatası!
    pause
    exit /b 1
)

echo.
echo 🏗️  Frontend Build Başlatılıyor...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Build hatası!
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Frontend build tamamlandı!
echo.

:: 3. VDS Güncelleme Seçeneği
echo ════════════════════════════════════════
echo   🌐 VDS Güncelleme
echo ════════════════════════════════════════
echo.
echo Şimdi VDS'e güncelleme yapmak için seçenekleriniz:
echo.
echo   1️⃣  SSH ile Otomatik Güncelleme (Önerilen)
echo   2️⃣  Manuel Komutları Göster
echo   3️⃣  Sadece Yerel Güncelleme (VDS'i atla)
echo.
set /p choice="Seçiminiz (1/2/3): "

if "%choice%"=="1" goto :vds_ssh
if "%choice%"=="2" goto :vds_manual
if "%choice%"=="3" goto :finish
goto :finish

:vds_ssh
echo.
echo ════════════════════════════════════════
echo   🔐 VDS SSH Bağlantısı
echo ════════════════════════════════════════
echo.

:: IP adresini temizle (root@ ön ekini kaldır)
set /p vds_input="VDS IP adresi (örn: 89.47.113.42): "
if "!vds_input!"=="" (
    echo ❌ IP adresi gerekli!
    pause
    exit /b 1
)

:: root@ ön ekini kaldır
set vds_ip=!vds_input!
set vds_ip=!vds_ip:root@=!

set /p vds_user="Kullanıcı adı (varsayılan: root): "
if "!vds_user!"=="" set vds_user=root

echo.
echo 📤 VDS'e bağlanılıyor: !vds_user!@!vds_ip!
echo 💡 İlk bağlantıda şifre sorulabilir...
echo.

:: SSH ile VDS'e bağlan ve güncelleme komutlarını çalıştır
ssh !vds_user!@!vds_ip! "cd /var/www/document-translation-system && git pull origin main && cd frontend && npm install && npm run build && cd ../backend && source ../venv/bin/activate && python3 manage.py collectstatic --noinput && systemctl restart eroxai && systemctl restart nginx && echo '✅ VDS güncelleme tamamlandı!'"

if errorlevel 1 (
    echo.
    echo ❌ VDS güncelleme hatası!
    echo 💡 SSH anahtarlarınızın yapılandırıldığından emin olun.
    pause
    exit /b 1
)

goto :finish

:vds_manual
echo.
echo ════════════════════════════════════════
echo   📋 VDS Manuel Güncelleme Komutları
echo ════════════════════════════════════════
echo.
echo VDS'e SSH ile bağlanıp şu komutları çalıştırın:
echo.
echo cd /var/www/document-translation-system
echo git pull origin main
echo cd frontend
echo npm install
echo npm run build
echo cd ../backend
echo source ../venv/bin/activate
echo python3 manage.py collectstatic --noinput
echo systemctl restart eroxai
echo systemctl restart nginx
echo systemctl status eroxai nginx
echo.
echo Veya tek komut:
echo bash /var/www/document-translation-system/update_vds.sh
echo.
pause
goto :finish

:finish
echo.
echo ════════════════════════════════════════
echo   ✅ Güncelleme Tamamlandı!
echo ════════════════════════════════════════
echo.
echo 📊 Yapılan İşlemler:
echo   ✅ Git pull yapıldı
echo   ✅ Frontend build edildi
echo   ✅ VDS güncellemesi yapıldı (eğer seçildiyse)
echo.
echo 🌐 Site: https://eroxai.org
echo 🔧 Admin: https://eroxai.org/admin
echo.
pause
