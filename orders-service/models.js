/**
 * Order Domain Model
 * Separates internal entity record from published JSON representation (Task C2).
 */

class Order {
  constructor({
    id,
    buyerId,
    items,
    totalAmount,
    deliveryAddress,
    status = 'pending',
    internalFarmerPayout = null,
    auditChecksum = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this._internalId = `int_km_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this.id = id;
    this.buyerId = buyerId;
    this.items = items;
    this.totalAmount = parseFloat(totalAmount);
    this.deliveryAddress = deliveryAddress;
    this.status = status;
    this.cancellationReason = null;
    this.internalFarmerPayout = internalFarmerPayout || (this.totalAmount * 0.92).toFixed(2); // 92% direct to farmer
    this.auditChecksum = auditChecksum || `chk_${Buffer.from(id + createdAt).toString('base64')}`;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.version = 1;
  }

  /**
   * Published representation for external clients.
   * Strips internal farmer payout formulas, DB surrogate keys, and audit checksums.
   */
  as_json() {
    const representation = {
      id: this.id,
      buyerId: this.buyerId,
      items: this.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        pricePerKg: item.pricePerKg || item.price,
        itemTotal: (item.quantity * (item.pricePerKg || item.price)).toFixed(2)
      })),
      totalAmount: this.totalAmount,
      deliveryAddress: this.deliveryAddress,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    if (this.cancellationReason) {
      representation.cancellationReason = this.cancellationReason;
    }

    return representation;
  }
}

module.exports = { Order };
