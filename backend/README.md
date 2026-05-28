# 💳 Hypnotic Core – Backend API

Production-ready Stripe Checkout, Order Management, and Export System for the 3D scroll experience platform.

## 🚀 Quick Start

```bash
cd backend
cp .env.example .env
# Edit .env with your Stripe keys
npm install
npm start
```

## 📡 API Endpoints

### `POST /api/create-checkout-session`
Create a Stripe Checkout session. The frontend redirects the user to this URL.

**Body:** `{ tier: "basic" | "pro" | "elite", customerEmail?: string }`

**Response:** `{ url: "https://checkout.stripe.com/...", sessionId: "..." }`

### `POST /api/webhook`
Stripe webhook endpoint. Handles `checkout.session.completed` events.

### `GET /api/orders`
List all orders (newest first).

### `GET /api/orders/:id`
Get a single order by ID.

### `POST /api/payment-links`
Create a reusable Stripe Payment Link.

**Body:** `{ tier: "basic" | "pro" | "elite" }`

**Response:** `{ url: "https://buy.stripe.com/..." }`

### `GET /api/health`
Health check.

## 💰 Pricing Tiers

| Tier   | Price   | Description                                      |
|--------|---------|--------------------------------------------------|
| Basic  | €299    | Single 3D scroll experience, premium preset      |
| Pro    | €999    | Full brand page, custom palette, sound design    |
| Elite  | €3.000+ | Multi-scene, custom shaders, video exports       |

## 🔧 Environment Variables

| Variable               | Required | Description                                |
|------------------------|----------|--------------------------------------------|
| `STRIPE_SECRET_KEY`    | Yes      | Stripe secret key (sk_test_... or sk_live_)|
| `STRIPE_WEBHOOK_SECRET`| No       | Stripe webhook signing secret              |
| `FRONTEND_URL`         | No       | Frontend URL for redirects                 |
| `PORT`                 | No       | Server port (default: 3001)                |

## ☁️ Vercel Deployment

The repo includes Vercel-ready serverless functions in `/api/`:

- `api/create-checkout-session.js` → `POST /api/create-checkout-session`
- `api/webhook.js` → `POST /api/webhook`
- `api/orders.js` → `GET /api/orders`
- `api/payment-links.js` → `POST /api/payment-links`

### Vercel Setup

```bash
npm i -g vercel
vercel link
vercel env add STRIPE_SECRET_KEY
vercel env add FRONTEND_URL
vercel deploy --prod
```

## 🎬 Puppeteer Export Service

```bash
cd puppeteer-service
npm install
npm start
```

**Endpoints:**

- `POST /render/screenshot` – Capture a screenshot of any URL
- `POST /render/video` – Capture scroll animation as sequential frames
- `GET /health` – Health check

## 🔄 CI/CD Pipeline

The `.github/workflows/deploy.yml` workflow:

1. **Quality check** – Lint and syntax validation on push/PR
2. **Deploy to Vercel** – Auto-deploys on `main` branch push
3. **GitHub Pages** – Also deploys static site to GitHub Pages

## 🧪 Mock Mode

Without `STRIPE_SECRET_KEY`, the API runs in mock mode and returns preview URLs instead of real Stripe sessions. This lets you test the full flow without a Stripe account.