/**
 * Catalogue Microservice Entry Point (Port 5002)
 */

const app = require('./app');

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`  🌾 Kisan Mitra Catalogue Microservice (REST)`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  Manages: Produce Listings | Stock | Mandi MSP`);
  console.log(`========================================================`);
});

module.exports = server;
