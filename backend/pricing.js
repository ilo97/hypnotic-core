/**
 * Stripe Product/Price IDs for the three tiers.
 * 
 * In development/test mode, create these via Stripe Dashboard.
 * In production, replace with your live mode price IDs.
 */

const PRICING_TIERS = {
  basic: {
    name: 'Basic – 3D Experience',
    description: 'Single-page 3D interactive experience with scroll-triggered animations. Perfect for product launches.',
    price: 29900, // €299.00 in cents
    currency: 'eur',
    priceId: process.env.STRIPE_PRICE_BASIC || 'price_basic',
  },
  pro: {
    name: 'Pro – Full Brand Experience',
    description: 'Multi-section 3D landing page with custom particles, sound design, and responsive design.',
    price: 99900, // €999.00
    currency: 'eur',
    priceId: process.env.STRIPE_PRICE_PRO || 'price_pro',
  },
  elite: {
    name: 'Elite – Immersive Brand World',
    description: 'Full immersive 3D world with AI-powered generation, custom sound branding, and priority support.',
    price: 300000, // €3,000.00
    currency: 'eur',
    priceId: process.env.STRIPE_PRICE_ELITE || 'price_elite',
  },
};

const TIER_KEYS = Object.keys(PRICING_TIERS);

/**
 * Get tier config by key or throw.
 */
function getTier(tierKey) {
  if (!TIER_KEYS.includes(tierKey)) {
    throw new Error(`Invalid tier: "${tierKey}". Valid options: ${TIER_KEYS.join(', ')}`);
  }
  return PRICING_TIERS[tierKey];
}

module.exports = { PRICING_TIERS, TIER_KEYS, getTier };
