# 🔒 GÜVENLİK – Aesthetic.Studio

## Mevcut Güvenlik Önlemleri
- ✅ **CSP (Content-Security-Policy)** – XSS koruması
- ✅ **Chatbot Input Sanitized** – Zararlı kod temizlenir
- ✅ **HTTPS** – GitHub Pages SSL
- ✅ **.gitignore** – node_modules + .env dışarıda
- ✅ **Stripe Mock Mode** – Canlı key yok

## Yapılması Gerekenler
1. **GitHub Token'ı Sil:** https://github.com/settings/tokens → eskiyi sil
2. **Stripe Canlıya Al:** `STRIPE_SECRET_KEY` ile canlı ödeme
3. **Backend Auth:** API'ye JWT auth ekle
4. **Rate Limiting:** DDoS koruması
5. **Email Notification:** Sipariş bildirimleri

## Token Güvenliği
- Token'ı koda GÖMME
- `.env` dosyasında sakla
- Düzenli olarak yenile
