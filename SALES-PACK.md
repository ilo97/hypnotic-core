# 🚀 AESTHETIC STUDIO – SALES PACK

## 📱 TIKTOK / IG REELS – "Scroll Hypnosis" Post

### Video: 15s montage
3 saniyede bir preset geçişi (Sport → Luxury → Tech), altyazı:

```
0-3s: "This is not a landing page."
3-6s: "This is a conversion machine."
6-9s: "Scroll-triggered 3D that makes people stop and buy."
9-12s: "No templates. No boring sites."
12-15s: "DM '3D' for yours. →"
```

### Caption:
> This is not a website. This is a conversion machine. Scroll-triggered 3D experiences that make people stop, feel, and buy. No templates. No boring landing pages. Just pure attention engineering. DM me "3D" if you want one. ✦

---

## 💬 DM SCRIPT – İlk 3 Müşteri İçin

### Kime: Instagram/LinkedIn'de premium markalar (parfüm, saat, araba, tech)

### DM (kopyala yapıştır):

```
Hey [name],

I build scroll-triggered 3D experiences for brands.

When someone lands on your page and scrolls, the world breaks apart around your product. Particles explode. Sound reacts. They don't click away.

Would a 30-second demo for your brand be interesting?

Cheers,
[your name]
```

### DM 2 – Eğer "Show me" derse:

```
Here's a live example: https://ilo97.github.io/hypnotic-core/

I can build one for your brand in 24h. 
Pricing starts at €299.

Want to try?
```

---

## 💳 STRIPE KURULUMU – API Tabanlı (5 DAKİKA)

✅ Artık API tabanlı Stripe Checkout çalışıyor — manuel link oluşturmaya gerek yok!

### Seçenek A: Canlı Stripe (Önerilen)

1. **Git:** https://dashboard.stripe.com/register
2. E-posta + şifre ile kaydol (5 dk)
3. **Dashboard → API Keys**'den `sk_test_...` veya `sk_live_...` anahtarını kopyala
4. `.env.example`'ı `.env`'ye kopyala, anahtarı yapıştır:

   ```bash
   cd backend
   cp .env.example .env
   # STRIPE_SECRET_KEY=sk_test_... yaz
   npm start
   ```

5. **Stripe Webhook** kurulumu (opsiyonel ama önerilir):
   - Dashboard → Webhooks → Add endpoint
   - URL: `https://hypnotic-core-api.vercel.app/api/webhook`
   - Events: `checkout.session.completed`
   
### Seçenek B: Mock Mod (Hemen başla)

API anahtarı olmadan da çalışır. Mock mod otomatik devreye girer:

```
"Buy Now" butonları → mock ödeme sayfasına yönlendirir
```

Gerçek ödeme almaya başlayınca Stripe anahtarını `.env`'ye eklemen yeterli.

## 🚀 VERCEL DEPLOY (Tek Komut)

```bash
npm i -g vercel
vercel link
vercel env add STRIPE_SECRET_KEY
vercel deploy --prod
```

Sonra frontend'deki `API_BASE` değişkenini Vercel URL'ine güncelle.

## 📊 SİPARİŞ TAKİBİ

Ödemeler alındıktan sonra siparişleri görüntüle:

```bash
curl https://hypnotic-core-api.vercel.app/api/orders
```

Veya local:

```bash
curl http://localhost:3001/api/orders
```

Her sipariş: ID, müşteri e-posta, tier, tutar, tarih içerir.

## 🔄 CI/CD PIPELINE

Her `git push main`'de otomatik:

1. ✅ Kod kalite kontrolü
2. ✅ Vercel'e deploy
3. ✅ GitHub Pages'e deploy

---

## 🔥 NEXT STEP

1. Bu sayfayı Instagram'da paylaş (video)
2. DM'den 3 kişiye yaz
3. Müşteri ödeme yapar → Sipariş otomatik oluşur
4. 24 saatte 3D sayfayı yap
5. Sen parayı al 💰

**Hazır mısın?** DM'lere başlayalım mı? 💪
