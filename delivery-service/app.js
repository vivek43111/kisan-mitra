/**
 * Kisan Mitra - Delivery & Logistics REST Microservice (Port 5003)
 * Framework: Express.js (REST Framework)
 */

const express = require('express');
const store = require('./store');

const app = express();

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// Health Probe
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'kisan-mitra-delivery-service',
    port: 5003,
    activeDeliveriesCount: store.list().length,
  });
});

// 1. GET /api/deliveries - List all shipments
app.get('/api/deliveries', (req, res) => {
  res.json(store.list());
});

// 2. GET /api/deliveries/:id - Get tracking timeline
app.get('/api/deliveries/:id', (req, res) => {
  const delivery = store.findByDeliveryId(req.params.id) || store.findByOrderId(req.params.id);
  if (!delivery) {
    return res.status(404).json({ error: 'Shipment not found' });
  }
  res.json(delivery);
});

// 3. POST /api/deliveries - Dispatch order for delivery
app.post('/api/deliveries', (req, res) => {
  const { orderId, produce, totalWeight, farmerPickup, buyerDropoff, payout } = req.body;

  if (!orderId || !farmerPickup || !buyerDropoff) {
    return res.status(400).json({ error: 'orderId, farmerPickup, and buyerDropoff are required.' });
  }

  const created = store.create({
    orderId,
    produce: produce || 'Agricultural Harvest',
    totalWeight: totalWeight || '10 kg',
    payout: payout || '₹500',
    farmerPickup,
    buyerDropoff,
  });

  res.status(201).json({
    message: 'Delivery shipment created successfully',
    delivery: created,
  });
});

// 4. PATCH /api/deliveries/:id/status - Update transit status
app.patch('/api/deliveries/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = store.updateStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Shipment not found' });
  }

  res.json({
    message: 'Shipment transit status updated',
    delivery: updated,
  });
});

module.exports = app;
