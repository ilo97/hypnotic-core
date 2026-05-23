/**
 * POST /api/webhook
 * 
 * Stripe Webhook endpoint – receives payment events and updates order status.
 * 
 * Events handled:
 *   - checkout.session.completed  → Create order, set to "paid"
 *   - checkout.session.async_payment_succeeded → Update to "paid"
 *   - checkout.session.async_payment_failed    → Update to "failed"
 * 
 * ⚠️ This route uses raw body parsing (express.raw) because Stripe
 *    needs the raw body for signature verification.
 */

const express = require('express');
const router = express.Router();
const stripe = require('../stripe');
const { createOrderFromSession, updateOrderBySessionId } = require('../models/order');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Use raw body parsing for Stripe webhook
router.use(express.raw({ type: 'application/json' }));

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // Verify the webhook signature if we have a secret
  if (endpointSecret && stripe) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  } else {
    // No secret configured – parse body directly (development mode)
    try {
      event = JSON.parse(req.body.toString());
    } catch {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    console.warn('⚠️  Webhook secret not set – skipping signature verification');
  }

  const eventType = event.type;
  const session = event.data?.object;
  console.log(`📡 Webhook received: ${eventType} (session: ${session?.id || 'unknown'})`);

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        if (session.payment_status === 'paid') {
          const order = createOrderFromSession(session);
          console.log(`✅ Order created: ${order.id} (tier: ${order.tier}, €${(order.amountTotal / 100).toFixed(2)})`);
        }
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const updated = updateOrderBySessionId(session.id, { status: 'paid' });
        console.log(`💰 Payment succeeded for session: ${session.id}`);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const updated = updateOrderBySessionId(session.id, { status: 'failed' });
        console.log(`❌ Payment failed for session: ${session.id}`);
        break;
      }

      default:
        console.log(`📡 Unhandled event type: ${eventType}`);
    }
  } catch (err) {
    console.error('❌ Webhook handler error:', err.message);
  }

  res.json({ received: true });
});

module.exports = router;