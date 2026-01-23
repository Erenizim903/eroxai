@echo off
chcp 65001 >nul
echo ========================================
echo   🚀 EroxAI Studio Kolay Güncelleme
echo ========================================
echo.

cd /d "%~dp0"

:: Git pull
echo 📥 Git pull yapılıyor...
git pull origin main
echo.

:: Frontend build
echo 🎨 Frontend build ediliyor...
cd frontend
call npm install
call npm run build
cd ..
echo.

echo ════════════════════════════════════════
echo   ✅ Yerel Güncelleme Tamamlandı!
echo ════════════════════════════════════════
echo.
echo 📋 Şimdi VDS'e güncelleme yapmak için:
echo.
echo   1. VDS'e SSH ile bağlan:
echo      ssh root@89.47.113.42
echo.
echo   2. Şu komutu çalıştır:
echo      bash /var/www/document-translation-system/update_vds.sh
echo.
echo   VEYA Manuel komutlar:
echo      cd /var/www/document-translation-system
echo      git pull origin main
echo      cd frontend
echo      npm install
echo      npm run build
echo      cd ../backend
echo      source ../venv/bin/activate
echo      python3 manage.py collectstatic --noinput
echo      systemctl restart eroxai
echo      systemctl restart nginx
echo.
pause
