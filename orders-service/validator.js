/**
 * Request Body Validator
 * Implements multi-field validation error collection (A06 Tasks C1, C2, B3)
 */

function validateOrderCreation(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      isValid: false,
      isMalformed: true,
      errors: [{ field: 'body', message: 'Request body must be a valid JSON object.' }]
    };
  }

  const errors = [];

  // Check deliveryAddress
  if (!body.deliveryAddress || typeof body.deliveryAddress !== 'string' || body.deliveryAddress.trim().length === 0) {
    errors.push({
      field: 'deliveryAddress',
      message: 'Delivery address is required and cannot be empty.'
    });
  } else if (body.deliveryAddress.trim().length < 5) {
    errors.push({
      field: 'deliveryAddress',
      message: 'Delivery address must be at least 5 characters long.'
    });
  }

  // Check items
  if (!body.items || !Array.isArray(body.items)) {
    errors.push({
      field: 'items',
      message: 'Order items must be a non-empty array.'
    });
  } else if (body.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'Order items cannot be empty; at least one produce item is required.'
    });
  } else {
    body.items.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push({
          field: `items[${index}]`,
          message: 'Item must be an object with productId and quantity.'
        });
        return;
      }
      if (!item.productId || typeof item.productId !== 'string' || item.productId.trim().length === 0) {
        errors.push({
          field: `items[${index}].productId`,
          message: 'Product ID is required.'
        });
      }
      if (item.quantity === undefined || item.quantity === null) {
        errors.push({
          field: `items[${index}].quantity`,
          message: 'Quantity is required.'
        });
      } else if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        errors.push({
          field: `items[${index}].quantity`,
          message: 'Quantity must be a positive integer greater than or equal to 1.'
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    isMalformed: false,
    errors
  };
}

function validateOrderPatch(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      isValid: false,
      isMalformed: true,
      errors: [{ field: 'body', message: 'Request body must be a valid JSON object.' }]
    };
  }

  const errors = [];
  const allowedFields = ['deliveryAddress', 'status'];
  const keys = Object.keys(body);

  if (keys.length === 0) {
    errors.push({ field: 'body', message: 'At least one field must be provided to modify.' });
  }

  if (body.deliveryAddress !== undefined) {
    if (typeof body.deliveryAddress !== 'string' || body.deliveryAddress.trim().length < 5) {
      errors.push({ field: 'deliveryAddress', message: 'Delivery address must be at least 5 characters.' });
    }
  }

  if (body.status !== undefined) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(body.status.toLowerCase())) {
      errors.push({ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}.` });
    }
  }

  return {
    isValid: errors.length === 0,
    isMalformed: false,
    errors
  };
}

module.exports = { validateOrderCreation, validateOrderPatch };
