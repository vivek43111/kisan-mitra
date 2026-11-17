/**
 * Delivery Microservice Entry Point (Port 5003)
 */

const app = require('./app');

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`  🚚 Kisan Mitra Delivery & Logistics Microservice (REST)`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  Manages: Farm Pickups | Cold-Chain Routes | Fulfillment`);
  console.log(`========================================================`);
});

module.exports = server;
