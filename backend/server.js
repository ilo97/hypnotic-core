#!/usr/bin/env node
/**
 * Hypnotic Core – Stripe Backend Server
 * 
 * Provides:
 * - POST /api/create-checkout-session – Creates a Stripe Checkout Session
 * - POST /api/webhook – Stripe webhook handler for payment events
 * - GET  /api/orders – List all orders
 * - GET  /api/orders/:id – Get a single order
 * - POST /api/payment-links – Create a reusable payment link
 * - POST /api/export/render – Puppeteer render request
 * 
 * Environment variables:
 * - STRIPE_SECRET_KEY (required)
 * - STRIPE_WEBHOOK_SECRET (optional, for webhook verification)
 * - FRONTEND_URL (default: https://ilo97.github.io/hypnotic-core/)
 * - PORT (default: 3001)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhook');
const orderRoutes = require('./routes/orders');
const paymentLinkRoutes = require('./routes/payment-links');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ilo97.github.io/hypnotic-core/';

// CORS – allow the frontend origin
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// ─── Routes ───────────────────────────────────────────────────────

// Webhook route MUST use raw body parsing (Stripe requires the raw body for signature verification)
app.use('/api/webhook', webhookRoutes);

// All other routes use JSON body parsing
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'hypnotic-core-api', timestamp: new Date().toISOString() });
});

// Checkout sessions
app.use('/api', checkoutRoutes);

// Order management
app.use('/api', orderRoutes);

// Payment links
app.use('/api', paymentLinkRoutes);

// ─── Start Server ──────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Hypnotic Core API running on http://0.0.0.0:${PORT}`);
  console.log(`📍 Frontend origin: ${FRONTEND_URL}`);
  console.log(`💳 Stripe mode: ${process.env.STRIPE_SECRET_KEY ? 'LIVE' : 'TEST (no key set)'}`);
});
