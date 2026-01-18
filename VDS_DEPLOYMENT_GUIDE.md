# VDS Deployment Guide (Backend + Frontend)

## 1) Sunucu Gereksinimleri
- Ubuntu 22.04
- 2 vCPU / 4 GB RAM önerilir
- Domain: `eroxai.org`

## 2) Backend Kurulum (Django)
```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nginx

cd /var/www/document-translation-system
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

### Ortam Değişkenleri
`backend/ENV_SAMPLE.md` içeriğini `.env` olarak kopyala ve doldur.

```bash
cp backend/ENV_SAMPLE.md backend/.env
```

### DB (Postgres)
```bash
sudo apt install -y postgresql
sudo -u postgres psql
CREATE DATABASE eroxai;
CREATE USER eroxai WITH PASSWORD 'yourpass';
GRANT ALL PRIVILEGES ON DATABASE eroxai TO eroxai;
```

### Migration + Superuser
```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

### Gunicorn + Systemd
```bash
cd /var/www/document-translation-system
gunicorn config.wsgi:application --bind 127.0.0.1:8000
```

## 3) Nginx Reverse Proxy
```nginx
server {
    server_name eroxai.org www.eroxai.org;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:8000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /var/www/document-translation-system/frontend/dist;
        try_files $uri /index.html;
    }

    location /media/ {
        alias /var/www/document-translation-system/backend/media/;
    }
}
```

## 4) SSL
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d eroxai.org -d www.eroxai.org
```

## 5) Admin Panel
- `https://eroxai.org/admin/`
- Buradan admin, premium key, şablon ve belgeleri yönet.
