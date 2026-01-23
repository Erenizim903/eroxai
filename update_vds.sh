#!/bin/bash
# EroxAI Studio VDS Güncelleme Scripti
# Kullanım: bash update_vds.sh

set -e

echo "🚀 EroxAI Studio VDS Güncelleme Başlatılıyor..."

# Proje dizinine git
cd /var/www/document-translation-system

# Git'ten son değişiklikleri çek
echo "📥 Git'ten son değişiklikler çekiliyor..."
git pull origin main

# Frontend build
echo "🎨 Frontend build ediliyor..."
cd frontend
npm install
npm run build

# Backend restart (değişiklik varsa)
echo "⚙️ Backend yeniden başlatılıyor..."
cd ../backend
source ../venv/bin/activate
python3 manage.py collectstatic --noinput
systemctl restart eroxai

# Nginx restart
echo "🌐 Nginx yeniden başlatılıyor..."
systemctl restart nginx

echo "✅ Güncelleme tamamlandı!"
echo "📊 Servis durumunu kontrol edin: systemctl status eroxai nginx"
