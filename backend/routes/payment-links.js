/**
 * POST /payment-links – Create a reusable Stripe Payment Link programmatically.
 * 
 * This is for admin use: generate a link that can be shared with clients
 * who want a fixed-price checkout.
 * 
 * Request body:
 *   { tier: "basic" | "pro" | "elite" }
 * 
 * Response:
 *   { url: "https://buy.stripe.com/..." }
 */

const express = require('express');
const router = express.Router();
const stripe = require('../stripe');
const { getTier } = require('../pricing');

router.post('/payment-links', async (req, res) => {
  try {
    const { tier } = req.body;

    if (!tier) {
      return res.status(400).json({ error: 'Missing required field: "tier". Options: basic, pro, elite' });
    }

    const tierConfig = getTier(tier);

    if (!stripe) {
      // Development mode – return mock link
      console.warn('⚠️  No Stripe key configured – returning mock payment link');
      return res.json({
        url: `https://buy.stripe.com/test_000?tier=${tier}`,
        mock: true,
        message: 'Set STRIPE_SECRET_KEY env var to enable real payment links',
      });
    }

    // Create a Stripe Payment Link via a price
    // First, create or retrieve the product
    let product;
    const products = await stripe.products.list({ active: true, limit: 100 });
    const existing = products.data.find(p => p.name === tierConfig.name);
    if (existing) {
      product = existing;
    } else {
      product = await stripe.products.create({
        name: tierConfig.name,
        description: tierConfig.description,
        metadata: { tier },
      });
    }

    // Create or reuse a price for this product
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
    let price;
    if (prices.data.length > 0) {
      price = prices.data[0];
    } else {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: tierConfig.price,
        currency: tierConfig.currency,
      });
    }

    // Create the payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { tier },
    });

    console.log(`🔗 Payment link created: ${paymentLink.url} (tier: ${tier})`);
    res.json({
      url: paymentLink.url,
      tier,
      amount: tierConfig.price / 100,
      currency: tierConfig.currency,
    });
  } catch (err) {
    console.error('❌ POST /payment-links error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;