/**
 * Vercel Serverless Function – POST /api/payment-links
 * 
 * Creates a reusable Stripe Payment Link programmatically.
 */

const Stripe = require('stripe');
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const IS_MOCK = !STRIPE_SECRET_KEY.startsWith('sk_');

const PRICING = {
  basic:  { name: 'Basic – 3D Experience', price: 29900, currency: 'eur' },
  pro:    { name: 'Pro – Full Brand Experience', price: 99900, currency: 'eur' },
  elite:  { name: 'Elite – Immersive Brand World', price: 300000, currency: 'eur' },
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tier } = req.body || {};
  const tierConfig = PRICING[tier];

  if (!tier || !tierConfig) {
    return res.status(400).json({
      error: `Invalid tier "${tier}". Options: ${Object.keys(PRICING).join(', ')}`,
    });
  }

  if (IS_MOCK) {
    return res.json({
      url: `https://buy.stripe.com/mock_${tier}`,
      tier, amount: tierConfig.price / 100, currency: tierConfig.currency,
      mock: true,
    });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const products = await stripe.products.list({ active: true, limit: 100 });
    let product = products.data.find(p => p.name === tierConfig.name);
    if (!product) {
      product = await stripe.products.create({ name: tierConfig.name, metadata: { tier } });
    }

    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
    let price = prices.data[0];
    if (!price) {
      price = await stripe.prices.create({ product: product.id, unit_amount: tierConfig.price, currency: tierConfig.currency });
    }

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { tier },
    });

    return res.json({ url: paymentLink.url, tier, amount: tierConfig.price / 100, currency: tierConfig.currency });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};