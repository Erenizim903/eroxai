@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM === AYARLAR ===
set VDS_IP=89.47.113.42
set REPO_URL=https://github.com/Erenizim903/eroxai.git
set PROJECT_DIR=/var/www/document-translation-system

REM === LOG ===
set LOG=%~dp0vds_reinstall.log
echo ==== START %DATE% %TIME% ==== > "%LOG%"

REM === SSH kontrol ===
where ssh >nul 2>&1
set ERR=!ERRORLEVEL!
if not "!ERR!"=="0" (
  echo SSH_BULUNAMADI: !ERR!
  echo SSH_BULUNAMADI: !ERR! >> "%LOG%"
  goto :end
)

REM === 1) LOCAL: GitHub'dan son kodu cek ===
pushd "%~dp0"
git pull origin main >> "%LOG%" 2>&1
set ERR=!ERRORLEVEL!
if not "!ERR!"=="0" (
  echo GITHUB_GUNCELLEME_HATASI: !ERR!
  echo GITHUB_GUNCELLEME_HATASI: !ERR! >> "%LOG%"
  popd
  goto :end
)
popd

REM === 2) VDS: SSH ile tek komutta kurulum ===
echo SSH_BASLIYOR >> "%LOG%"
ssh root@%VDS_IP% "set -e; \
systemctl stop eroxai-backend || true; \
systemctl stop nginx || true; \
rm -rf %PROJECT_DIR%; \
mkdir -p /var/www; \
cd /var/www; \
git clone %REPO_URL% document-translation-system; \
cd %PROJECT_DIR%; \
python3 -m venv .venv; \
. .venv/bin/activate; \
cd backend; \
pip install -r requirements.txt; \
python manage.py migrate; \
python manage.py collectstatic --noinput; \
cd ..; \
cd frontend; \
npm install; \
npm run build; \
cd ..; \
systemctl start eroxai-backend; \
systemctl restart nginx; \
echo 'DONE'" >> "%LOG%" 2>&1
set ERR=!ERRORLEVEL!
if not "!ERR!"=="0" (
  echo VDS_GUNCELLEME_HATASI: !ERR!
  echo VDS_GUNCELLEME_HATASI: !ERR! >> "%LOG%"
  goto :end
)

echo TAMAMLANDI
echo TAMAMLANDI >> "%LOG%"

:end
echo.
echo Log dosyasi: %LOG%
pause
