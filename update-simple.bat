@echo off
chcp 65001 >nul
echo 🚀 EroxAI Güncelleme Başlatılıyor...
echo.

cd /d "%~dp0"

:: Git pull
echo 📥 Git pull yapılıyor...
git pull origin main

:: Frontend build
echo 🎨 Frontend build ediliyor...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo ✅ Güncelleme tamamlandı!
echo.
echo 🌐 VDS'e güncelleme için:
echo    SSH ile bağlanıp: bash /var/www/document-translation-system/update_vds.sh
echo.
pause
