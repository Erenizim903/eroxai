@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   🌐 EroxAI VDS Güncelleme (Şifre ile)
echo ========================================
echo.

:: VDS Bilgileri
set /p vds_input="VDS IP adresi (örn: 89.47.113.42): "
if "!vds_input!"=="" (
    echo ❌ IP adresi gerekli!
    pause
    exit /b 1
)

:: root@ ön ekini kaldır
set vds_ip=!vds_input!
set vds_ip=!vds_ip:root@=!

set /p vds_user="Kullanıcı (varsayılan: root): "
if "!vds_user!"=="" set vds_user=root

echo.
echo 📤 VDS'e bağlanılıyor: !vds_user!@!vds_ip!
echo 🔐 SSH şifresi sorulacak...
echo.

:: SSH ile VDS'e bağlan (şifre ister)
ssh !vds_user!@!vds_ip! "cd /var/www/document-translation-system && git pull origin main && cd frontend && npm install && npm run build && cd ../backend && source ../venv/bin/activate && python3 manage.py collectstatic --noinput && systemctl restart eroxai && systemctl restart nginx && echo '✅ VDS güncelleme tamamlandı!' && systemctl status eroxai --no-pager -l"

if errorlevel 1 (
    echo.
    echo ❌ Hata oluştu!
    echo 💡 SSH bağlantısını kontrol edin.
    pause
    exit /b 1
)

echo.
echo ✅ VDS güncelleme tamamlandı!
pause
