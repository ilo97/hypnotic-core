/**
 * Order data model – persists orders to a JSON file.
 * 
 * In production, replace this with a database (SQLite, Postgres, etc.).
 * We use a JSON file for zero-dependency simplicity during the MVP phase.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure orders file exists
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
}

/**
 * Read all orders from disk.
 */
function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Write orders to disk.
 */
function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

/**
 * Create a new order from a Stripe Checkout Session.
 */
function createOrderFromSession(session) {
  const orders = readOrders();
  const order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent || null,
    customerEmail: session.customer_details?.email || session.customer_email || 'unknown',
    customerName: session.customer_details?.name || 'Unknown',
    tier: session.metadata?.tier || 'unknown',
    amountTotal: session.amount_total || 0,
    currency: session.currency || 'eur',
    status: session.payment_status || 'unpaid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: session.metadata || {},
  };
  orders.push(order);
  writeOrders(orders);
  return order;
}

/**
 * Update an order's status (e.g., when a webhook fires).
 */
function updateOrderBySessionId(stripeSessionId, updates) {
  const orders = readOrders();
  const idx = orders.findIndex(o => o.stripeSessionId === stripeSessionId);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() };
  writeOrders(orders);
  return orders[idx];
}

/**
 * Get all orders.
 */
function getAllOrders() {
  return readOrders();
}

/**
 * Get a single order by ID.
 */
function getOrderById(orderId) {
  const orders = readOrders();
  return orders.find(o => o.id === orderId) || null;
}

module.exports = {
  createOrderFromSession,
  updateOrderBySessionId,
  getAllOrders,
  getOrderById,
};