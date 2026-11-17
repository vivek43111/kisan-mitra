/**
 * Thread-Safe In-Memory Store with Idempotency Key Caching
 */

const { Order } = require('./models');

class Store {
  constructor() {
    this.orders = new Map();
    this.idempotencyStore = new Map();
    this.nextId = 101;
    this.seedSampleData();
  }

  seedSampleData() {
    const sample = new Order({
      id: '1',
      buyerId: 'BUYER-01',
      items: [
        { productId: 'PROD-WHEAT-01', quantity: 10, pricePerKg: 35.00 },
        { productId: 'PROD-RICE-02', quantity: 5, pricePerKg: 60.00 }
      ],
      totalAmount: 650.00,
      deliveryAddress: 'Farmgate Mandi Block B, Anand, Gujarat',
      status: 'pending'
    });
    this.orders.set('1', sample);
  }

  get(id) {
    return this.orders.get(String(id)) || null;
  }

  getAll({ status } = {}) {
    let list = Array.from(this.orders.values());
    if (status) {
      list = list.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }
    return list;
  }

  create(data, idempotencyKey = null) {
    const id = String(this.nextId++);
    const totalAmount = data.totalAmount || data.items.reduce((acc, item) => {
      const price = item.pricePerKg || item.price || 50;
      return acc + (item.quantity * price);
    }, 0);

    const order = new Order({
      id,
      buyerId: data.buyerId || 'BUYER-01',
      items: data.items,
      totalAmount,
      deliveryAddress: data.deliveryAddress,
      status: 'pending'
    });

    this.orders.set(id, order);

    if (idempotencyKey) {
      this.idempotencyStore.set(idempotencyKey, {
        orderId: id,
        status: 201,
        body: order.as_json(),
        location: `/orders/${id}`
      });
    }

    return order;
  }

  update(id, patch) {
    const order = this.get(id);
    if (!order) return null;

    if (patch.deliveryAddress) {
      order.deliveryAddress = patch.deliveryAddress;
    }
    if (patch.status) {
      order.status = patch.status;
    }
    order.updatedAt = new Date().toISOString();
    order.version += 1;
    return order;
  }

  cancel(id, reason = 'Buyer requested cancellation') {
    const order = this.get(id);
    if (!order) return null;

    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.updatedAt = new Date().toISOString();
    order.version += 1;
    return order;
  }

  delete(id) {
    return this.orders.delete(String(id));
  }

  getIdempotent(key) {
    if (!key) return null;
    return this.idempotencyStore.get(key) || null;
  }

  reset() {
    this.orders.clear();
    this.idempotencyStore.clear();
    this.nextId = 101;
    this.seedSampleData();
  }
}

const storeInstance = new Store();
module.exports = storeInstance;
