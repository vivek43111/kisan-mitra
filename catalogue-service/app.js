/**
 * Kisan Mitra - Catalogue REST Microservice (Port 5002)
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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'kisan-mitra-catalogue-service',
    port: 5002,
    totalCropsListed: store.list().length,
  });
});

// 1. GET /api/crops - List all crops (supports ?search=&category=)
app.get('/api/crops', (req, res) => {
  const { search, category } = req.query;
  const list = store.list({ search, category });
  res.json(list);
});

// 2. GET /api/crops/:id - Read single crop details
app.get('/api/crops/:id', (req, res) => {
  const crop = store.findById(req.params.id);
  if (!crop) {
    return res.status(404).json({ error: 'Crop listing not found' });
  }
  res.json(crop);
});

// 3. POST /api/crops - Farmer lists a new crop
app.post('/api/crops', (req, res) => {
  const { name, price, stockKg, category, emoji, farmer, location, description } = req.body;

  if (!name || price === undefined || stockKg === undefined) {
    return res.status(400).json({ error: 'Crop name, price, and stock quantity are required.' });
  }

  const created = store.create({
    name,
    price,
    stockKg,
    category,
    emoji,
    farmer,
    location,
    description,
  });

  res.status(201).json({
    message: 'Crop published to marketplace successfully',
    crop: created,
  });
});

// 4. PATCH /api/crops/:id/stock - Update stock or toggle inStock/outOfStock
app.patch('/api/crops/:id/stock', (req, res) => {
  const { stockKg, inStock } = req.body;
  const updated = store.updateStock(req.params.id, { stockKg, inStock });

  if (!updated) {
    return res.status(404).json({ error: 'Crop not found' });
  }

  res.json({
    message: 'Produce stock updated successfully',
    crop: updated,
  });
});

// 5. DELETE /api/crops/:id - Remove crop listing
app.delete('/api/crops/:id', (req, res) => {
  const deleted = store.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Crop not found' });
  }
  res.json({ message: 'Crop listing removed from marketplace' });
});

module.exports = app;
