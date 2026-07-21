/**
 * Vercel Serverless Function – GET /api/verify-payment?session_id=xxx
 *
 * Real server-side payment verification. Asks Stripe directly whether a
 * given Checkout Session was actually paid — this is the source of truth,
 * not anything stored in the browser. A visitor cannot fabricate a valid
 * session_id (Stripe generates these, they're long and unguessable), and
 * even if they could guess one, this endpoint checks *Stripe's own record*
 * of payment status, not anything the client sent.
 */

const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const IS_MOCK = !STRIPE_SECRET_KEY.startsWith('sk_');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id } = req.query || {};
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  // Mock mode: no real Stripe key configured yet — mirrors the mock
  // behavior of create-checkout-session.js so the flow is testable
  // before real Stripe keys are added.
  if (IS_MOCK) {
    const isMockSession = session_id.startsWith('mock_');
    return res.json({ paid: isMockSession, tier: isMockSession ? session_id.split('_')[1] : null, mock: true });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === 'paid';
    return res.json({
      paid,
      tier: session.metadata?.tier || null,
      customerEmail: session.customer_details?.email || null,
      mock: false,
    });
  } catch (err) {
    // Invalid/unknown session_id, or Stripe API error — treat as unpaid
    console.error('[verify-payment] Stripe error:', err.message);
    return res.status(200).json({ paid: false, error: 'Session not found or invalid' });
  }
};
