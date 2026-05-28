/**
 * Vercel Serverless Function – POST /api/create-checkout-session
 * 
 * Creates a Stripe Checkout Session for a given pricing tier.
 */

const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://ilo97.github.io/hypnotic-core/';

const IS_MOCK = !STRIPE_SECRET_KEY.startsWith('sk_');

const PRICING = {
  basic: { name: 'Basic – 3D Experience', price: 29900, currency: 'eur' },
  pro:    { name: 'Pro – Full Brand Experience', price: 99900, currency: 'eur' },
  elite:  { name: 'Elite – Immersive Brand World', price: 300000, currency: 'eur' },
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tier, customerEmail, metadata } = req.body || {};
  const tierConfig = PRICING[tier];

  if (!tier || !tierConfig) {
    return res.status(400).json({
      error: `Invalid tier "${tier}". Options: ${Object.keys(PRICING).join(', ')}`,
    });
  }

  // ─── Mock mode ────────────────────────────────────────────────
  if (IS_MOCK) {
    console.log(`🔶 [Vercel] MOCK checkout: tier=${tier}, amount=€${tierConfig.price / 100}`);
    return res.json({
      url: `${FRONTEND_URL}?tier=${tier}&amount=${tierConfig.price / 100}&status=paid`,
      sessionId: `mock_${tier}_${Date.now()}`,
      mock: true,
    });
  }

  // ─── Real Stripe ──────────────────────────────────────────────
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: tierConfig.currency,
          product_data: { name: tierConfig.name },
          unit_amount: tierConfig.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${FRONTEND_URL}?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${FRONTEND_URL}?status=cancelled`,
      customer_email: customerEmail || undefined,
      metadata: { tier, ...(metadata || {}) },
    });

    return res.json({ url: session.url, sessionId: session.id, mock: false });
  } catch (err) {
    console.error('❌ [Vercel] Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};