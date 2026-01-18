@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   🌐 EroxAI VDS Güncelleme
echo ========================================
echo.

:: VDS Bilgileri
set /p vds_input="VDS IP/Hostname (örn: 89.47.113.42): "
if "!vds_input!"=="" (
    echo ❌ IP adresi gerekli!
    pause
    exit /b 1
)

:: root@ ön ekini kaldır (eğer varsa)
set vds_ip=!vds_input!
set vds_ip=!vds_ip:root@=!

set /p vds_user="Kullanıcı (varsayılan: root): "
if "!vds_user!"=="" set vds_user=root

echo.
echo 📤 VDS'e bağlanılıyor: !vds_user!@!vds_ip!
echo 💡 İlk bağlantıda şifre sorulabilir...
echo.

:: VDS güncelleme komutlarını çalıştır
ssh !vds_user!@!vds_ip! "cd /var/www/document-translation-system && git pull origin main && cd frontend && npm install && npm run build && cd ../backend && source ../venv/bin/activate && python3 manage.py collectstatic --noinput && systemctl restart eroxai && systemctl restart nginx && echo '✅ Tamamlandı!' && systemctl status eroxai --no-pager -l"

if errorlevel 1 (
    echo.
    echo ❌ Hata oluştu!
    echo 💡 SSH anahtarlarınızın yapılandırıldığından emin olun.
    pause
    exit /b 1
)

echo.
echo ✅ VDS güncelleme tamamlandı!
pause
