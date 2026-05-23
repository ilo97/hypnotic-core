/**
 * GET  /orders         – List all orders
 * GET  /orders/:id     – Get a single order by ID
 */

const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById } = require('../models/order');

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

module.exports = router;