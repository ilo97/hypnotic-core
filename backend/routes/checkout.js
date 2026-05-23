/**
 * POST /create-checkout-session
 * 
 * Creates a Stripe Checkout Session for the given pricing tier.
 * 
 * Request body:
 *   { tier: "basic" | "pro" | "elite", customerEmail?: string, metadata?: object }
 * 
 * Response:
 *   { url: "https://checkout.stripe.com/..." }
 *   The frontend should redirect the user to this URL.
 */

const express = require('express');
const router = express.Router();
const stripe = require('../stripe');
const { getTier } = require('../pricing');

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ilo97.github.io/hypnotic-core/';

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { tier, customerEmail, metadata } = req.body;

    if (!tier) {
      return res.status(400).json({ error: 'Missing required field: "tier". Options: basic, pro, elite' });
    }

    const tierConfig = getTier(tier);

    if (!stripe) {
      // No Stripe key set – return a mock URL for development
      console.warn('⚠️  No Stripe key configured – returning mock checkout URL');
      return res.json({
        url: `https://buy.stripe.com/test_000?tier=${tier}&amount=${tierConfig.price / 100}`,
        mock: true,
        message: 'Set STRIPE_SECRET_KEY env var to enable real payments',
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: tierConfig.currency,
            product_data: {
              name: tierConfig.name,
              description: tierConfig.description,
            },
            unit_amount: tierConfig.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${FRONTEND_URL}?status=cancelled`,
      customer_email: customerEmail || undefined,
      metadata: {
        tier,
        ...(metadata || {}),
      },
    });

    console.log(`✅ Checkout session created: ${session.id} (tier: ${tier}, amount: €${(tierConfig.price / 100).toFixed(0)})`);
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('❌ create-checkout-session error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;