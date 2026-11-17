/**
 * Per-Client Rate Limiter Middleware (A05 Task B5)
 */

const { problem } = require('./errors');

const clients = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 50;

function rateLimit(req, res, next) {
  // Allow test header to trigger rate limit deterministically
  if (req.headers['x-test-rate-limit'] === 'force-exceed') {
    res.setHeader('X-RateLimit-Limit', '50');
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('Retry-After', '60');
    return problem(res, {
      status: 429,
      title: 'Too Many Requests',
      detail: 'Per-client rate limit of 50 requests/minute exceeded. Please back off.',
      type: 'https://kisanmitra.in/errors/rate-limit-exceeded'
    });
  }

  const clientId = req.headers['authorization'] || req.ip || 'anonymous-client';
  const now = Date.now();

  let clientData = clients.get(clientId);
  if (!clientData || now > clientData.resetTime) {
    clientData = { count: 0, resetTime: now + WINDOW_MS };
    clients.set(clientId, clientData);
  }

  clientData.count += 1;
  const remaining = Math.max(0, MAX_REQUESTS - clientData.count);

  res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS));
  res.setHeader('X-RateLimit-Remaining', String(remaining));

  if (clientData.count > MAX_REQUESTS) {
    const retryAfterSec = Math.ceil((clientData.resetTime - now) / 1000);
    res.setHeader('Retry-After', String(retryAfterSec));
    return problem(res, {
      status: 429,
      title: 'Too Many Requests',
      detail: `Per-client budget exceeded (${MAX_REQUESTS} req/min). Try again in ${retryAfterSec} seconds.`,
      type: 'https://kisanmitra.in/errors/rate-limit-exceeded'
    });
  }

  next();
}

module.exports = { rateLimit };
