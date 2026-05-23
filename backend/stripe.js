/**
 * Stripe SDK instance – single shared instance across all routes.
 * 
 * Uses STRIPE_SECRET_KEY from environment.
 * If no valid key is set, the system runs in mock/development mode.
 * 
 * Mock mode: Returns placeholder URLs instead of real Stripe Checkout sessions.
 *            The frontend works without a live Stripe account during dev.
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const IS_MOCK_MODE = !STRIPE_SECRET_KEY || !STRIPE_SECRET_KEY.startsWith('sk_');

let stripe = null;

if (!IS_MOCK_MODE) {
  try {
    const Stripe = require('stripe');
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
    console.log(`✅ Stripe initialized (${STRIPE_SECRET_KEY.startsWith('sk_live') ? 'LIVE' : 'TEST'} mode)`);
  } catch (err) {
    console.error('❌ Failed to initialize Stripe:', err.message);
    console.log('⚠️  Falling back to mock mode');
  }
} else {
  console.log('⚠️  Stripe mock mode – no STRIPE_SECRET_KEY configured');
  console.log('   Set STRIPE_SECRET_KEY=sk_test_... in .env for real payments');
}

module.exports = { stripe, IS_MOCK_MODE };