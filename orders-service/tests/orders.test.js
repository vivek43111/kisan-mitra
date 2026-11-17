/**
 * Automated Test Suite for Kisan Mitra Orders Service
 * Tests CS543 Assignments 4, 5, and 6 specifications.
 */

const request = require('supertest');
const app = require('../app');
const store = require('../store');

const AUTH_HEADER = 'Bearer test_token_kisan_mitra_buyer_123';

beforeEach(() => {
  store.reset();
});

describe('Kisan Mitra Orders Service API Tests', () => {

  // 1. Authentication Check (A05 Task B3)
  test('POST /orders without auth token returns 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/orders')
      .send({ deliveryAddress: 'Village Kheda, Anand', items: [{ productId: 'PROD-WHEAT-01', quantity: 2 }] });

    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.title).toBe('Unauthorized');
    expect(res.body.type).toBe('https://kisanmitra.in/errors/unauthorized');
  });

  // 2. Validation & RFC 7807 Multi-Field 422 (A06 Task B3, C1, C2)
  test('POST /orders with multiple bad fields returns 422 with errors[] list', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', AUTH_HEADER)
      .send({
        deliveryAddress: '', // invalid: empty
        items: [{ productId: '', quantity: 0 }] // invalid: empty productId, quantity <= 0
      });

    expect(res.status).toBe(422);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.title).toBe('Validation Failed');
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(2);
  });

  // 3. Successful Creation with 201 and Location Header (A04 Task C5, A05 Task B2)
  test('POST /orders with valid payload succeeds with 201, Location, and ETag', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', AUTH_HEADER)
      .send({
        deliveryAddress: 'Main Mandi Yard, Rajkot, Gujarat',
        items: [{ productId: 'PROD-COTTON-05', quantity: 3, pricePerKg: 120 }]
      });

    expect(res.status).toBe(201);
    expect(res.headers['location']).toMatch(/\/orders\/\d+/);
    expect(res.headers['etag']).toBeDefined();
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('pending');
    expect(res.body.totalAmount).toBe(360);
  });

  // 4. Safe Retry via Idempotency-Key (A04 Task C7, A05 Task C3)
  test('POST /orders repeated with identical Idempotency-Key returns cached response without duplicate creation', async () => {
    const key = 'idem-km-order-998877';
    const payload = {
      deliveryAddress: 'APMC Market Yard Gate 2, Surat',
      items: [{ productId: 'PROD-PULSES-02', quantity: 4, pricePerKg: 85 }]
    };

    // First call
    const res1 = await request(app)
      .post('/orders')
      .set('Authorization', AUTH_HEADER)
      .set('Idempotency-Key', key)
      .send(payload);

    expect(res1.status).toBe(201);
    const orderId = res1.body.id;

    // Repeat call with identical key
    const res2 = await request(app)
      .post('/orders')
      .set('Authorization', AUTH_HEADER)
      .set('Idempotency-Key', key)
      .send(payload);

    expect(res2.status).toBe(201);
    expect(res2.body.id).toBe(orderId);
    expect(res2.headers['location']).toBe(res1.headers['location']);
  });

  // 5. Query Filter on GET /orders (A05 Task A4)
  test('GET /orders?status=pending returns filtered list of pending orders', async () => {
    const res = await request(app)
      .get('/orders?status=pending');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].status).toBe('pending');
  });

  // 6. Read Single Item with ETag (A05 Task B4)
  test('GET /orders/:id returns 200 and ETag header', async () => {
    const res = await request(app)
      .get('/orders/1');

    expect(res.status).toBe(200);
    expect(res.headers['etag']).toBeDefined();
    expect(res.headers['cache-control']).toBeDefined();
    expect(res.body.id).toBe('1');
  });

  // 7. Conditional GET -> 304 Not Modified (A05 Task C1)
  test('GET /orders/:id with matching If-None-Match returns 304 Not Modified', async () => {
    const initial = await request(app).get('/orders/1');
    const etag = initial.headers['etag'];

    const res = await request(app)
      .get('/orders/1')
      .set('If-None-Match', etag);

    expect(res.status).toBe(304);
    expect(res.text).toBe('');
  });

  // 8. Missing Resource -> 404 Problem Details (A04 Task C5, A06 Task A1)
  test('GET /orders/:id with unknown ID returns 404 Problem Details', async () => {
    const res = await request(app)
      .get('/orders/99999');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.title).toBe('Order Not Found');
  });

  // 9. Conditional Write without If-Match -> 428 (A05 Task C2)
  test('PATCH /orders/:id without If-Match returns 428 Precondition Required', async () => {
    const res = await request(app)
      .patch('/orders/1')
      .set('Authorization', AUTH_HEADER)
      .send({ deliveryAddress: 'New Address, Vadodara' });

    expect(res.status).toBe(428);
    expect(res.body.title).toBe('Precondition Required');
  });

  // 10. Conditional Write with stale If-Match -> 412 (A05 Task C2)
  test('PATCH /orders/:id with outdated If-Match returns 412 Precondition Failed', async () => {
    const res = await request(app)
      .patch('/orders/1')
      .set('Authorization', AUTH_HEADER)
      .set('If-Match', '"stale_hash_12345"')
      .send({ deliveryAddress: 'Updated Farm Warehouse' });

    expect(res.status).toBe(412);
    expect(res.body.title).toBe('Precondition Failed');
  });

  // 11. Conditional Write with matching If-Match succeeds -> 200 (A05 Task C2)
  test('PATCH /orders/:id with valid If-Match updates order and returns 200', async () => {
    const initial = await request(app).get('/orders/1');
    const etag = initial.headers['etag'];

    const res = await request(app)
      .patch('/orders/1')
      .set('Authorization', AUTH_HEADER)
      .set('If-Match', etag)
      .send({ deliveryAddress: 'Updated Warehouse 4B, Mehsana, Gujarat' });

    expect(res.status).toBe(200);
    expect(res.body.deliveryAddress).toBe('Updated Warehouse 4B, Mehsana, Gujarat');
  });

  // 12. Non-CRUD Action: Cancel Order (A05 Task A2)
  test('POST /orders/:id/cancel returns 202 Accepted on first call, 200 on repeat', async () => {
    // First cancellation -> 202 Accepted
    const res1 = await request(app)
      .post('/orders/1/cancel')
      .set('Authorization', AUTH_HEADER)
      .send({ reason: 'Farmer delayed dispatch' });

    expect(res1.status).toBe(202);
    expect(res1.body.order.status).toBe('cancelled');

    // Repeated cancellation -> 200 OK (safe to retry)
    const res2 = await request(app)
      .post('/orders/1/cancel')
      .set('Authorization', AUTH_HEADER)
      .send({ reason: 'Farmer delayed dispatch' });

    expect(res2.status).toBe(200);
  });

  // 13. Method Discovery: OPTIONS (A05 Task A5)
  test('OPTIONS /orders/:id returns 204 with Allow header', async () => {
    const res = await request(app).options('/orders/1');

    expect(res.status).toBe(204);
    expect(res.headers['allow']).toContain('GET');
    expect(res.headers['allow']).toContain('PATCH');
    expect(res.headers['allow']).toContain('DELETE');
  });

  // 14. Content Negotiation: XML (A06 Task C3)
  test('GET /orders/:id with Accept: application/xml returns valid XML', async () => {
    const res = await request(app)
      .get('/orders/1')
      .set('Accept', 'application/xml');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/xml/);
    expect(res.text).toContain('<order>');
    expect(res.text).toContain('<id>1</id>');
  });

  // 15. Content Negotiation: Unsupported type -> 406 (A05 Task B1)
  test('GET /orders/:id with unsupported Accept returns 406 Not Acceptable', async () => {
    const res = await request(app)
      .get('/orders/1')
      .set('Accept', 'image/png');

    expect(res.status).toBe(406);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.title).toBe('Not Acceptable');
  });

  // 16. Rate Limiting Signal & 429 Retry-After (A05 Task B5)
  test('Request with exceeded budget returns 429 and Retry-After header', async () => {
    const res = await request(app)
      .get('/orders')
      .set('X-Test-Rate-Limit', 'force-exceed');

    expect(res.status).toBe(429);
    expect(res.headers['retry-after']).toBe('60');
    expect(res.body.title).toBe('Too Many Requests');
  });

  // 17. DELETE /orders/:id -> 204 No Content (A05 Task A1)
  test('DELETE /orders/:id deletes order and returns 204 No Content', async () => {
    const res = await request(app)
      .delete('/orders/1')
      .set('Authorization', AUTH_HEADER);

    expect(res.status).toBe(204);
    expect(res.text).toBe('');

    // Verification: order is gone -> 404
    const check = await request(app).get('/orders/1');
    expect(check.status).toBe(404);
  });
});
