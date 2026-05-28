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
const { stripe, IS_MOCK_MODE } = require('../stripe');
const { createOrderFromSession, updateOrderBySessionId } = require('../models/order');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Use raw body parsing for Stripe webhook
router.use(express.raw({ type: 'application/json' }));

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // Mock mode: accept webhook events without verification
  if (IS_MOCK_MODE || !stripe) {
    try {
      event = JSON.parse(req.body.toString());
      console.log('🔶 MOCK webhook received:', event.type);
    } catch {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  } else {
    // Verify the webhook signature
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
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
        updateOrderBySessionId(session.id, { status: 'paid' });
        console.log(`💰 Payment succeeded for session: ${session.id}`);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        updateOrderBySessionId(session.id, { status: 'failed' });
        console.log(`❌ Payment failed for session: ${session.id}`);
        break;
      }

      case 'order.submitted': {
        // Order form submitted with creative brief after payment
        const orderData = event.data?.object;
        if (orderData) {
          const fs = require('fs');
          const path = require('path');
          const ordersDir = path.join(__dirname, '..', 'data', 'briefs');
          if (!fs.existsSync(ordersDir)) fs.mkdirSync(ordersDir, { recursive: true });
          const filename = `brief-${orderData.email}-${Date.now()}.json`;
          fs.writeFileSync(path.join(ordersDir, filename), JSON.stringify(orderData, null, 2), 'utf8');
          console.log(`📋 Creative brief saved: ${filename} (${orderData.tier}, ${orderData.email})`);
        }
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