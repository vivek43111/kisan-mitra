/**
 * Delivery Microservice Datastore (Port 5003)
 * Manages logistics routes, farm pickups, and doorstep buyer fulfillment.
 */

const INITIAL_DELIVERIES = [
  {
    deliveryId: 'DLV-1001',
    orderId: 'KM1001',
    produce: 'Rice (Basmati 1121) - 50 kg, Sharbati Wheat - 20 kg',
    totalWeight: '70 kg',
    payout: '₹2,890',
    farmerPickup: {
      name: 'Ramesh Kumar',
      address: 'Farm House #12, GT Road, Ludhiana',
      state: 'Punjab',
      phone: '9876543210',
    },
    buyerDropoff: {
      name: 'Pooja Sharma',
      address: 'B-402, Green Avenue, Alkapuri',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390007',
      phone: '9123456789',
    },
    status: 'In Transit',
    timeline: [
      { time: '2026-10-28 09:30', event: 'Order Placed by Buyer' },
      { time: '2026-10-28 14:00', event: 'Harvest collected from Farmer field (Ludhiana)' },
      { time: '2026-10-29 06:00', event: 'Dispatched in cold-chain logistics transit' },
    ],
  },
  {
    deliveryId: 'DLV-1002',
    orderId: 'KM1002',
    produce: 'Organic Tomato - 25 kg',
    totalWeight: '25 kg',
    payout: '₹875',
    farmerPickup: {
      name: 'Amit Kumar',
      address: 'Plot 4, Farm Belt, Ranchi',
      state: 'Jharkhand',
      phone: '9833445566',
    },
    buyerDropoff: {
      name: 'Rajesh Kirana Store',
      address: 'Station Road, Market Square',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395003',
      phone: '9822334455',
    },
    status: 'Order Placed',
    timeline: [
      { time: '2026-10-29 07:15', event: 'Order Placed — Awaiting Farm Collection' },
    ],
  },
];

class DeliveryStore {
  constructor() {
    this.deliveries = [...INITIAL_DELIVERIES];
  }

  list() {
    return this.deliveries;
  }

  findByDeliveryId(deliveryId) {
    return this.deliveries.find((d) => d.deliveryId === deliveryId);
  }

  findByOrderId(orderId) {
    return this.deliveries.find((d) => d.orderId === orderId);
  }

  create(deliveryData) {
    const newDelivery = {
      deliveryId: 'DLV-' + Date.now().toString().slice(-4),
      status: 'Order Placed',
      timeline: [
        {
          time: new Date().toLocaleString('en-IN'),
          event: 'Order Placed — Awaiting Farm Collection',
        },
      ],
      ...deliveryData,
    };
    this.deliveries.unshift(newDelivery);
    return newDelivery;
  }

  updateStatus(deliveryId, newStatus) {
    const delivery = this.findByDeliveryId(deliveryId) || this.findByOrderId(deliveryId);
    if (!delivery) return null;

    delivery.status = newStatus;
    delivery.timeline.push({
      time: new Date().toLocaleString('en-IN'),
      event: `Status updated to: ${newStatus}`,
    });
    return delivery;
  }
}

module.exports = new DeliveryStore();
