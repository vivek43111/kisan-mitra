/**
 * Server entry point for Kisan Mitra Orders Service
 */

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Kisan Mitra Orders Service running on http://localhost:${PORT}`);
});

module.exports = server;
