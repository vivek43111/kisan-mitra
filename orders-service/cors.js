/**
 * CORS Middleware & Preflight Handling (A05 Task B6)
 */

function corsMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key, If-Match, If-None-Match, X-HTTP-Method-Override, Accept');
  res.setHeader('Access-Control-Expose-Headers', 'Location, ETag, X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE, OPTIONS');
    return res.status(204).end();
  }

  next();
}

module.exports = { corsMiddleware };
