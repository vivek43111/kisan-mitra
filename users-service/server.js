/**
 * Users Microservice Entry Point (Port 5001)
 */

const app = require('./app');

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`  🌾 Kisan Mitra Users Microservice (REST)`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  Roles: FARMER | BUYER | DELIVERY | ADMIN`);
  console.log(`========================================================`);
});

module.exports = server;
