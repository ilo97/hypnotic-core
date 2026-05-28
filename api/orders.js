/**
 * Vercel Serverless Function – GET /api/orders
 * 
 * Returns all processed orders from the /tmp/orders.json file.
 * Note: On Vercel, /tmp is ephemeral per-instance. For production,
 * replace with a real database (SQLite, Supabase, etc.).
 */

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const dataFile = path.join('/tmp', 'orders.json');
    let orders = [];
    try {
      orders = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch {
      // No orders yet
    }

    // If a specific order ID is requested
    const { id } = req.query;
    if (id) {
      const order = orders.find(o => o.id === id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json({ order });
    }

    return res.json({ orders: orders.reverse(), total: orders.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};