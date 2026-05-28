/**
 * Vercel Serverless Function – POST /api/webhook
 * 
 * Stripe Webhook handler – receives payment events.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join('/tmp', 'orders.json');

function readOrders() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; }
}

function writeOrders(orders) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

function createOrder(session) {
  const orders = readOrders();
  const order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    stripeSessionId: session.id,
    customerEmail: session.customer_details?.email || session.customer_email || 'unknown',
    customerName: session.customer_details?.name || 'Unknown',
    tier: session.metadata?.tier || 'unknown',
    amountTotal: session.amount_total || 0,
    currency: session.currency || 'eur',
    status: 'paid',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  writeOrders(orders);
  return order;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let event;
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const eventType = event.type;
  const session = event.data?.object;

  if (eventType === 'checkout.session.completed' && session?.payment_status === 'paid') {
    const order = createOrder(session);
    console.log(`✅ [Vercel Webhook] Order: ${order.id} (${order.tier}, €${(order.amountTotal / 100).toFixed(2)})`);
  }

  res.json({ received: true });
};