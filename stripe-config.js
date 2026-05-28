/**
 * Stripe Configuration for Aesthetic.Studio
 * 
 * Defines the 3 pricing tiers, API endpoint, and product metadata.
 * 
 * Usage:
 *   import { STRIPE_CONFIG, PRICING_TIERS, checkout } from './stripe-config.js'
 * 
 * Environment:
 *   Set STRIPE_SECRET_KEY in your .env for live payments.
 *   Without it, mock mode returns preview URLs automatically.
 */

const STRIPE_CONFIG = {
  // API base URL – change to your deployed Vercel URL in production
  API_BASE: process.env.API_BASE || 'https://hypnotic-core-api.vercel.app',

  // Frontend URL for redirects after payment
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://ilo97.github.io/hypnotic-core/',

  // Stripe mode (auto-detected from STRIPE_SECRET_KEY)
  // Mock mode = no key set, returns preview URLs
  IS_MOCK: !process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith('sk_'),

  // Currency
  CURRENCY: 'eur',

  // Delivery times
  DELIVERY: {
    basic: '24 hours',
    pro: '3 days',
    elite: '7–14 days',
  },
};

/**
 * Three pricing tiers for Aesthetic.Studio
 * 
 * Each tier has:
 *   - id: unique key for API calls
 *   - name: display name
 *   - price: price in cents (e.g., 29900 = €299.00)
 *   - currency: ISO currency code
 *   - description: short pitch for the card
 *   - features: list of included items
 *   - delivery: estimated delivery time
 *   - badge: optional badge text (e.g., "Popular")
 *   - priceId: Stripe Price ID (set via env for live mode)
 */
const PRICING_TIERS = [
  {
    id: 'basic',
    name: 'Basic Ad Page',
    price: 29900,
    currency: 'eur',
    description: 'One scroll experience. Premium preset. Live in 24h. Hosted link.',
    features: [
      '3D scroll experience with particle system',
      'Premium visual preset (Sport, Luxury, Tech, or Cosmic)',
      'Hypnotic sound design (no voice)',
      'Live hosted link (GitHub Pages)',
      '14-day delivery guarantee',
    ],
    delivery: '24 hours',
    badge: null,
    priceId: process.env.STRIPE_PRICE_BASIC || null,
  },
  {
    id: 'pro',
    name: 'Conversion Page',
    price: 99900,
    currency: 'eur',
    description: 'Custom palette + typo. 3 variants. Sound design. Product integration.',
    features: [
      'Everything in Basic, plus:',
      'Custom color palette & typography',
      '3 visual variants (A/B test ready)',
      'Product/logo integration',
      'Custom hypnotic sound identity',
      'Scroll-triggered camera animation',
      'Responsive design (desktop + mobile)',
    ],
    delivery: '3 days',
    badge: 'Popular',
    priceId: process.env.STRIPE_PRICE_PRO || null,
  },
  {
    id: 'elite',
    name: 'Full Campaign',
    price: 300000,
    currency: 'eur',
    description: 'Multi-scene. Custom shaders. Video exports. Brand kit. Priority support.',
    features: [
      'Everything in Pro, plus:',
      'Multi-scene immersive 3D world',
      'Custom GLSL shader effects',
      'Video export (MP4, Reel, TikTok formats)',
      'Complete brand kit integration',
      'AI-powered prompt-to-3D generation',
      'Priority support & unlimited revisions',
      'Dedicated project manager',
    ],
    delivery: '7–14 days',
    badge: 'Elite',
    priceId: process.env.STRIPE_PRICE_ELITE || null,
  },
];

/**
 * Format a price from cents to a human-readable string.
 * @param {number} cents - Price in cents (e.g., 29900)
 * @returns {string} Formatted price (e.g., "€299")
 */
function formatPrice(cents) {
  return `€${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/**
 * Initiate a Stripe Checkout session for the given tier.
 * This function is called from the frontend Buy Now buttons.
 * 
 * @param {string} tierId - One of 'basic', 'pro', 'elite'
 * @param {object} options - Optional: { customerEmail, metadata }
 * @returns {Promise<{url: string, mock: boolean}>}
 */
async function checkout(tierId, options = {}) {
  const tier = PRICING_TIERS.find(t => t.id === tierId);
  if (!tier) throw new Error(`Unknown tier: ${tierId}`);

  const apiUrl = `${STRIPE_CONFIG.API_BASE}/api/create-checkout-session`;

  console.log(`💳 Checkout: ${tier.name} (${formatPrice(tier.price)})`);

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tier: tierId,
      customerEmail: options.customerEmail || undefined,
      metadata: {
        source: 'aesthetic-studio-platform',
        ...(options.metadata || {}),
      },
    }),
  });

  const data = await res.json();

  if (!data.url) {
    throw new Error(data.error || 'Failed to create checkout session');
  }

  return { url: data.url, mock: data.mock || false, sessionId: data.sessionId };
}

/**
 * Get a tier config by ID.
 */
function getTier(tierId) {
  return PRICING_TIERS.find(t => t.id === tierId) || null;
}

/**
 * Payment Link Generator – creates reusable payment links.
 * Returns Stripe Payment Link URLs (one per tier).
 */
const PAYMENT_LINKS = {
  basic: process.env.STRIPE_LINK_BASIC || 'https://buy.stripe.com/mock_basic',
  pro: process.env.STRIPE_LINK_PRO || 'https://buy.stripe.com/mock_pro',
  elite: process.env.STRIPE_LINK_ELITE || 'https://buy.stripe.com/mock_elite',
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STRIPE_CONFIG,
    PRICING_TIERS,
    PAYMENT_LINKS,
    formatPrice,
    checkout,
    getTier,
  };
}