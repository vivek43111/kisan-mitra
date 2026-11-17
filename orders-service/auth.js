/**
 * Bearer Token Authorization Middleware (A05 Task B3)
 */

const { problem } = require('./errors');

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return problem(res, {
      status: 401,
      title: 'Unauthorized',
      detail: 'Missing Authorization header. Expected Bearer token.',
      type: 'https://kisanmitra.in/errors/unauthorized'
    });
  }

  const parts = authHeader.trim().split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer' || parts[1].length === 0) {
    return problem(res, {
      status: 401,
      title: 'Unauthorized',
      detail: 'Invalid Authorization header format. Expected "Bearer <token>".',
      type: 'https://kisanmitra.in/errors/unauthorized'
    });
  }

  req.user = { token: parts[1] };
  next();
}

module.exports = { requireAuth };
