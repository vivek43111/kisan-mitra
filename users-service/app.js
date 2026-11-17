/**
 * Kisan Mitra - Users REST Microservice (Port 5001)
 * Framework: Express.js (REST Framework)
 */

const express = require('express');
const store = require('./store');

const app = express();

// Global Middleware
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
    service: 'kisan-mitra-users-service',
    port: 5001,
    registeredUsersCount: store.list().length,
  });
});

// 1. POST /api/users/register
app.post('/api/users/register', (req, res) => {
  const { name, phone, email, password, role, address, city, state, pincode, cropOrBusiness } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Name, phone, and password are required fields.' });
  }

  const existing = store.findByPhoneOrEmail(phone);
  if (existing) {
    return res.status(409).json({ error: 'User with this phone number already registered.' });
  }

  const createdUser = store.create({
    name,
    phone,
    email: email || '',
    password,
    role: role ? role.toUpperCase() : 'BUYER',
    address: address || '',
    city: city || '',
    state: state || 'Gujarat',
    pincode: pincode || '',
    cropOrBusiness: cropOrBusiness || '',
  });

  // Strip password in response
  const { password: _, ...userSafe } = createdUser;
  res.status(201).json({
    message: 'User registered successfully',
    user: userSafe,
    token: 'jwt-kisan-' + userSafe.id,
  });
});

// 2. POST /api/users/login
app.post('/api/users/login', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier (phone/email) and password are required.' });
  }

  const user = store.findByPhoneOrEmail(identifier);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid mobile number/email or password.' });
  }

  if (user.status === 'SUSPENDED') {
    return res.status(403).json({ error: 'Account is suspended. Please contact Kisan Mitra Administration.' });
  }

  const { password: _, ...userSafe } = user;
  res.json({
    message: 'Login successful',
    user: userSafe,
    token: 'jwt-kisan-' + userSafe.id,
  });
});

// 3. GET /api/users/profile/:id
app.get('/api/users/profile/:id', (req, res) => {
  const user = store.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { password: _, ...userSafe } = user;
  res.json(userSafe);
});

// 4. PUT /api/users/profile/:id
app.put('/api/users/profile/:id', (req, res) => {
  const updated = store.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { password: _, ...userSafe } = updated;
  res.json({
    message: 'Profile updated successfully',
    user: userSafe,
  });
});

// 5. GET /api/users (Admin user listing)
app.get('/api/users', (req, res) => {
  const { role, status } = req.query;
  const list = store.list({ role, status }).map(({ password, ...u }) => u);
  res.json(list);
});

// 6. PATCH /api/users/:id/status
app.patch('/api/users/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status || !['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status.toUpperCase())) {
    return res.status(400).json({ error: 'Status must be ACTIVE, SUSPENDED, or PENDING.' });
  }
  const updated = store.updateStatus(req.params.id, status.toUpperCase());
  if (!updated) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ message: 'User status updated', user: updated });
});

module.exports = app;
