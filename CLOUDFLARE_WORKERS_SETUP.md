# ☁️ Cloudflare Workers Kurulum (Google Vision + OpenAI)

Bu kurulum sayesinde API anahtarların gizli kalır ve frontend güvenli şekilde kullanır.

---

## 1) Worker oluştur
1. Cloudflare Dashboard → **Workers & Pages**
2. **Create Application** → **Workers**
3. "Hello World" yerine **JavaScript Worker** seç
4. Worker ismi ver (ör. `eroxai-workers`)

---

## 2) Worker kodunu ekle
Bu repo içindeki `cloudflare/worker.js` dosyasının içeriğini
Cloudflare editor’a **tamamen yapıştır** ve **Save** et.

---

## 3) Secrets ekle (API keyler)
Worker → **Settings** → **Variables**
**Secrets** olarak ekle:
- `OPENAI_API_KEY`
- `GOOGLE_VISION_API_KEY`

> Bu anahtarlar görünmez olur, frontend’e sızmaz.

---

## 4) Publish
Worker’ı **Publish** et. URL şu formda olur:
`https://eroxai-workers.<subdomain>.workers.dev`

---

## 5) Frontend ayarları
Sitede **Ayarlar** sekmesine gir:
- **Worker Base URL** → Worker URL’ni yaz
- **Google Vision OCR kullan** → Aç
- **OpenAI çeviri kullan** → Aç
- **OpenAI Model** → `gpt-4o-mini` (veya istediğin)

Kaydet.

---

## 6) Test
- OCR çalıştır
- Çeviri çalıştır
Eğer hata alırsan Worker Logs’da mesajı görürsün.
