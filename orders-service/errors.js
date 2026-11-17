/**
 * Uniform RFC 7807 Problem Details Error Helper
 * Format: application/problem+json
 */

const DEFAULT_TYPES = {
  400: 'https://kisanmitra.in/errors/bad-request',
  401: 'https://kisanmitra.in/errors/unauthorized',
  403: 'https://kisanmitra.in/errors/forbidden',
  404: 'https://kisanmitra.in/errors/not-found',
  406: 'https://kisanmitra.in/errors/not-acceptable',
  409: 'https://kisanmitra.in/errors/conflict',
  412: 'https://kisanmitra.in/errors/precondition-failed',
  422: 'https://kisanmitra.in/errors/validation-error',
  428: 'https://kisanmitra.in/errors/precondition-required',
  429: 'https://kisanmitra.in/errors/rate-limit-exceeded',
  500: 'https://kisanmitra.in/errors/internal-server-error',
  502: 'https://kisanmitra.in/errors/bad-gateway',
  503: 'https://kisanmitra.in/errors/service-unavailable'
};

const DEFAULT_TITLES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Resource Not Found',
  406: 'Not Acceptable',
  409: 'State Conflict',
  412: 'Precondition Failed',
  422: 'Unprocessable Entity',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable'
};

function problem(res, { status = 500, title, detail, type, errors, extra = {} }) {
  const statusCode = parseInt(status, 10);
  const problemBody = {
    type: type || DEFAULT_TYPES[statusCode] || 'about:blank',
    title: title || DEFAULT_TITLES[statusCode] || 'An error occurred',
    status: statusCode,
    detail: detail || 'No further details provided.',
    ...extra
  };

  if (Array.isArray(errors) && errors.length > 0) {
    problemBody.errors = errors;
  }

  res.status(statusCode);
  res.setHeader('Content-Type', 'application/problem+json; charset=utf-8');
  return res.json(problemBody);
}

module.exports = { problem, DEFAULT_TYPES, DEFAULT_TITLES };
