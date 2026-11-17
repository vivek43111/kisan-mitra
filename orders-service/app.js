/**
 * Kisan Mitra Orders Service Express Application
 * Implements CS543 Assignments 4, 5, and 6
 */

const express = require('express');
const path = require('path');
const store = require('./store');
const { problem } = require('./errors');
const { validateOrderCreation, validateOrderPatch } = require('./validator');
const { handleConditionalRead, checkConditionalWrite, generateETag } = require('./etag');
const { rateLimit } = require('./rateLimit');
const { requireAuth } = require('./auth');
const { corsMiddleware } = require('./cors');
const { handleContentNegotiation, sendNegotiated } = require('./negotiate');
const { securityHeaders } = require('./security');

const app = express();

// Global Pipeline Middleware
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(rateLimit);
app.use(handleContentNegotiation);

// Support X-HTTP-Method-Override for constrained clients (A05 Task A5)
app.use((req, res, next) => {
  const override = req.headers['x-http-method-override'];
  if (override && req.method === 'POST') {
    req.method = override.toUpperCase();
  }
  next();
});

// JSON Parser with 400 error handling for malformed JSON
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return problem(res, {
      status: 400,
      title: 'Malformed JSON',
      detail: 'Request body contains invalid JSON syntax.',
      type: 'https://kisanmitra.in/errors/bad-request'
    });
  }
  next(err);
});

// Serve Static Assets for Interactive Demonstration Portal
app.use(express.static(path.join(__dirname, 'public')));

// Root route: Serve Interactive Portal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'kisan-mitra-orders-service' });
});

// Serve OpenAPI YAML
app.get('/openapi.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// Interactive Swagger GUI (A4, A5, A6 API Explorer)
app.get('/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kisan Mitra Orders Service API - Interactive Swagger GUI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; padding: 0; background: #f7fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .top-banner { background: #2f855a; color: white; padding: 12px 24px; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; align-items: center; }
  </style>
</head>
<body>
  <div class="top-banner">
    <span>🌾 Kisan Mitra Orders Service API — CS543 Interactive GUI</span>
    <span style="font-size: 12px; font-weight: normal;">IIIT Vadodara</span>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/openapi.yaml',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis]
      });
    };
  </script>
</body>
</html>`);
});

// ==========================================
// 1. POST /orders - Create Order (A4, A5, A6)
// ==========================================
app.post('/orders', requireAuth, (req, res, next) => {
  try {
    const idempotencyKey = req.headers['idempotency-key'];

    // Check Idempotency Key cache (A04 Task C7, A05 Task C3)
    if (idempotencyKey) {
      const cached = store.getIdempotent(idempotencyKey);
      if (cached) {
        res.setHeader('Location', cached.location);
        res.setHeader('ETag', generateETag(cached.body));
        return sendNegotiated(req, res, cached.status, cached.body);
      }
    }

    // Validate request body (A06 Tasks C1, C2, B3)
    const validation = validateOrderCreation(req.body);
    if (!validation.isValid) {
      if (validation.isMalformed) {
        return problem(res, {
          status: 400,
          title: 'Malformed Request Body',
          detail: validation.errors[0].message,
          type: 'https://kisanmitra.in/errors/bad-request'
        });
      }
      return problem(res, {
        status: 422,
        title: 'Validation Failed',
        detail: 'The submitted order payload failed field-level schema validation.',
        type: 'https://kisanmitra.in/errors/validation-error',
        errors: validation.errors
      });
    }

    // Domain check: ensure produce stock/availability
    if (req.body.items.some(item => item.productId === 'PROD-OUT-OF-STOCK')) {
      return problem(res, {
        status: 409,
        title: 'Produce Unavailable',
        detail: 'One or more selected farm items are out of stock with local farmers.',
        type: 'https://kisanmitra.in/errors/item-unavailable'
      });
    }

    // Create Order in store
    const order = store.create(req.body, idempotencyKey);
    const representation = order.as_json();

    res.setHeader('Location', `/orders/${order.id}`);
    res.setHeader('ETag', generateETag(representation));
    return sendNegotiated(req, res, 201, representation);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 2. GET /orders - List Orders (Filtered)
// ==========================================
app.get('/orders', (req, res, next) => {
  try {
    const { status } = req.query;
    const orders = store.getAll({ status });
    const listRepresentation = orders.map(o => o.as_json());
    return sendNegotiated(req, res, 200, listRepresentation);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 3. GET /orders/:id - Read Single Order (ETag / 304)
// ==========================================
app.get('/orders/:id', (req, res, next) => {
  try {
    const order = store.get(req.params.id);
    if (!order) {
      return problem(res, {
        status: 404,
        title: 'Order Not Found',
        detail: `No order found matching ID: ${req.params.id}`,
        type: 'https://kisanmitra.in/errors/order-not-found'
      });
    }

    const representation = order.as_json();
    const handled304 = handleConditionalRead(req, res, representation);
    if (!handled304) {
      return sendNegotiated(req, res, 200, representation);
    }
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 4. PATCH /orders/:id - Modify Order (If-Match / 412)
// ==========================================
app.patch('/orders/:id', requireAuth, (req, res, next) => {
  try {
    const order = store.get(req.params.id);
    if (!order) {
      return problem(res, {
        status: 404,
        title: 'Order Not Found',
        detail: `No order found matching ID: ${req.params.id}`,
        type: 'https://kisanmitra.in/errors/order-not-found'
      });
    }

    // Check If-Match header (A05 Task C2)
    const canProceed = checkConditionalWrite(req, res, order.as_json());
    if (!canProceed) return;

    // Validate patch payload
    const validation = validateOrderPatch(req.body);
    if (!validation.isValid) {
      return problem(res, {
        status: 422,
        title: 'Invalid Update',
        detail: 'The submitted patch payload failed field-level validation.',
        type: 'https://kisanmitra.in/errors/validation-error',
        errors: validation.errors
      });
    }

    // State conflict check: cannot patch a cancelled or delivered order
    if (order.status === 'cancelled' || order.status === 'delivered') {
      return problem(res, {
        status: 409,
        title: 'Illegal State Modification',
        detail: `Cannot update an order in '${order.status}' status.`,
        type: 'https://kisanmitra.in/errors/illegal-transition'
      });
    }

    const updated = store.update(req.params.id, req.body);
    const representation = updated.as_json();
    res.setHeader('ETag', generateETag(representation));
    return sendNegotiated(req, res, 200, representation);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 5. POST /orders/:id/cancel - Non-CRUD Action (A05 Task A2)
// ==========================================
app.post('/orders/:id/cancel', requireAuth, (req, res, next) => {
  try {
    const order = store.get(req.params.id);
    if (!order) {
      return problem(res, {
        status: 404,
        title: 'Order Not Found',
        detail: `No order found matching ID: ${req.params.id}`,
        type: 'https://kisanmitra.in/errors/order-not-found'
      });
    }

    // If already cancelled, safe & idempotent return 200 (A05 Task A3)
    if (order.status === 'cancelled') {
      return sendNegotiated(req, res, 200, {
        message: 'Order was already cancelled previously.',
        order: order.as_json()
      });
    }

    // If delivered or shipped, cannot cancel
    if (order.status === 'delivered' || order.status === 'shipped') {
      return problem(res, {
        status: 409,
        title: 'Cancellation Refused',
        detail: `Order cannot be cancelled because it has already reached '${order.status}' status.`,
        type: 'https://kisanmitra.in/errors/illegal-transition'
      });
    }

    const reason = req.body && req.body.reason ? req.body.reason : 'Buyer requested cancellation';
    const cancelled = store.cancel(req.params.id, reason);
    return sendNegotiated(req, res, 202, {
      message: 'Order cancellation accepted for processing.',
      order: cancelled.as_json()
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 6. DELETE /orders/:id - Remove Order (A05 Task A1)
// ==========================================
app.delete('/orders/:id', requireAuth, (req, res, next) => {
  try {
    const order = store.get(req.params.id);
    if (!order) {
      return problem(res, {
        status: 404,
        title: 'Order Not Found',
        detail: `No order found matching ID: ${req.params.id}`,
        type: 'https://kisanmitra.in/errors/order-not-found'
      });
    }

    store.delete(req.params.id);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 7. OPTIONS /orders/:id - Method Discovery (A05 Task A5)
// ==========================================
app.options('/orders/:id', (req, res) => {
  res.setHeader('Allow', 'GET, POST, PATCH, DELETE, OPTIONS');
  return res.status(204).end();
});

// Catch-all 404
app.use((req, res) => {
  problem(res, {
    status: 404,
    title: 'Endpoint Not Found',
    detail: `The requested path ${req.method} ${req.originalUrl} does not exist.`,
    type: 'https://kisanmitra.in/errors/not-found'
  });
});

// Global Error Handler - never leak stack traces (A06 Task B4)
app.use((err, req, res, next) => {
  console.error('[Internal Error]:', err.message);
  problem(res, {
    status: 500,
    title: 'Internal Server Error',
    detail: 'An internal error occurred processing your request. Please contact support.',
    type: 'https://kisanmitra.in/errors/internal-server-error'
  });
});

module.exports = app;
