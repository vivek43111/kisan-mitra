/**
 * Kisan Mitra - AI Service Entry Point (Port 5004)
 */

const app = require('./app');

const PORT = process.env.PORT || 5004;

const server = app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`  🤖 Kisan Mitra AI Agro-Advisory & Vision Service (REST)`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  Engine: Google Gemini 1.5 + ICAR Plant Pathology KB`);
  console.log(`  Endpoints:`);
  console.log(`  - GET  /health`);
  console.log(`  - POST /api/ai/chat              (Kisan Sahayak AI)`);
  console.log(`  - POST /api/ai/diagnose          (Crop Disease Vision)`);
  console.log(`  - POST /api/ai/price-advisor     (Mandi Price Estimator)`);
  console.log(`  - POST /api/ai/generate-description (Auto Catalog Writer)`);
  console.log(`========================================================`);
});

module.exports = server;
