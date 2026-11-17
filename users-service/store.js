/**
 * Users Microservice In-Memory Datastore (Port 5001)
 * Manages Farmer, Buyer, Delivery Partner, and Admin accounts.
 */

const INITIAL_USERS = [
  {
    id: 'USR101',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    email: 'ramesh@kisanmitra.in',
    password: 'farmer123',
    role: 'FARMER',
    state: 'Punjab',
    city: 'Ludhiana',
    address: 'Farm House #12, GT Road',
    pincode: '141001',
    cropOrBusiness: 'Wheat & Basmati Rice',
    status: 'ACTIVE',
    createdAt: '2026-10-15T08:00:00Z',
  },
  {
    id: 'USR202',
    name: 'Pooja Sharma',
    phone: '9123456789',
    email: 'pooja@example.com',
    password: 'buyer123',
    role: 'BUYER',
    state: 'Gujarat',
    city: 'Vadodara',
    address: 'B-402, Green Avenue, Alkapuri',
    pincode: '390007',
    cropOrBusiness: 'Household Consumer',
    status: 'ACTIVE',
    createdAt: '2026-10-20T10:30:00Z',
  },
  {
    id: 'DLV8801',
    name: 'Vikram Logistics & Transport',
    phone: '9811223344',
    email: 'delivery@kisanmitra.in',
    password: 'delivery123',
    role: 'DELIVERY',
    state: 'Gujarat',
    city: 'Vadodara',
    address: 'Hub #4, Transport Nagar, Makarpura',
    pincode: '390010',
    cropOrBusiness: 'Cold Chain Agricultural Transport',
    status: 'ACTIVE',
    createdAt: '2026-10-22T14:15:00Z',
  },
  {
    id: 'ADMIN01',
    name: 'System Administrator',
    phone: '9999900000',
    email: 'admin@kisanmitra.in',
    password: 'admin123',
    role: 'ADMIN',
    state: 'Gujarat',
    city: 'Gandhinagar',
    address: 'Govt Agriculture Directorate Complex',
    pincode: '382010',
    cropOrBusiness: 'Platform Supervision',
    status: 'ACTIVE',
    createdAt: '2026-10-01T09:00:00Z',
  },
];

class UserStore {
  constructor() {
    this.users = [...INITIAL_USERS];
  }

  create(userData) {
    const newUser = {
      id: 'USR' + Date.now().toString().slice(-6),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  findByPhoneOrEmail(identifier) {
    const clean = identifier.trim().toLowerCase();
    return this.users.find(
      (u) =>
        u.phone === clean ||
        u.email.toLowerCase() === clean ||
        u.id.toLowerCase() === clean
    );
  }

  findById(id) {
    return this.users.find((u) => u.id === id);
  }

  update(id, updateData) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updateData };
    return this.users[idx];
  }

  list({ role, status } = {}) {
    let result = this.users;
    if (role) {
      result = result.filter((u) => u.role === role.toUpperCase());
    }
    if (status) {
      result = result.filter((u) => u.status === status.toUpperCase());
    }
    return result;
  }

  updateStatus(id, newStatus) {
    const user = this.findById(id);
    if (!user) return null;
    user.status = newStatus;
    return user;
  }
}

module.exports = new UserStore();
