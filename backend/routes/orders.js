/**
 * GET  /orders         – List all orders
 * GET  /orders/:id     – Get a single order by ID
 */

const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById } = require('../models/order');
const fs = require('fs');
const path = require('path');

// GET /orders – List all orders (newest first)
router.get('/orders', (_req, res) => {
  try {
    const orders = getAllOrders().reverse(); // newest first
    res.json({ orders, total: orders.length });
  } catch (err) {
    console.error('❌ GET /orders error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /orders/:id – Get a single order
router.get('/orders/:id', (req, res) => {
  try {
    const order = getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    console.error('❌ GET /orders/:id error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /briefs – List all submitted creative briefs (order forms)
router.get('/briefs', (_req, res) => {
  try {
    const briefsDir = path.join(__dirname, '..', 'data', 'briefs');
    if (!fs.existsSync(briefsDir)) {
      return res.json({ briefs: [], total: 0 });
    }
    const files = fs.readdirSync(briefsDir).filter(f => f.endsWith('.json'));
    const briefs = files.map(f => {
      const raw = fs.readFileSync(path.join(briefsDir, f), 'utf8');
      const data = JSON.parse(raw);
      return { ...data, filename: f };
    }).reverse();
    res.json({ briefs, total: briefs.length });
  } catch (err) {
    console.error('❌ GET /briefs error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;