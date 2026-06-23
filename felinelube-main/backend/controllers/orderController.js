const prisma = require('../config/db');
const {
  sanitizeStr, sanitizeFloat, sanitizeInt, safeJsonParse, isValidEmail, isValidMalaysianPhone
} = require('../utils/sanitize');

// Whitelist of allowed order statuses
const ALLOWED_ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// ---------------------------------------------------------------
// @desc    Create new order
// @route   POST /api/orders
// @access  Public (guest checkout)
// ---------------------------------------------------------------
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, address, totalAmount, items, paymentMethod } = req.body;
    // SECURITY (IDOR): userId MUST come from the authenticated session token,
    // never from the request body. This prevents any caller from forging a
    // userId to link orders to an arbitrary user account.
    const authenticatedUserId = (req.user && req.userType === 'user') ? req.user.id : null;

    // Validate required fields
    if (!customerName || !customerPhone || !address || !totalAmount || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    // SANITIZE: customer name
    const cleanName = sanitizeStr(customerName, 150);
    if (!cleanName) return res.status(400).json({ message: 'Invalid customer name' });

    // SANITIZE: phone number
    const cleanPhone = sanitizeStr(customerPhone, 30);
    if (!cleanPhone || !isValidMalaysianPhone(cleanPhone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // SANITIZE: address
    const cleanAddress = sanitizeStr(address, 500);
    if (!cleanAddress) return res.status(400).json({ message: 'Invalid address' });

    // SANITIZE: total amount
    const parsedTotal = sanitizeFloat(totalAmount, 0.01);
    if (parsedTotal === null) return res.status(400).json({ message: 'Invalid order total' });

    // SANITIZE: payment method
    const cleanPayment = sanitizeStr(paymentMethod, 50);

    // Limit order items count to prevent resource abuse
    if (items.length > 50) {
      return res.status(400).json({ message: 'Order contains too many items' });
    }

    // SANITIZE + validate each order item
    for (const item of items) {
      const qty   = sanitizeInt(item.quantity, 1, 9999);
      const price = sanitizeFloat(item.price, 0);
      if (!item.productId || typeof item.productId !== 'string' || item.productId.length > 128) {
        return res.status(400).json({ message: 'Invalid product reference in order' });
      }
      if (qty === null) return res.status(400).json({ message: 'Invalid item quantity' });
      if (price === null) return res.status(400).json({ message: 'Invalid item price' });
    }

    // Generate a unique order number
    const timestamp   = Date.now().toString(36).toUpperCase();
    const random      = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `FEL-${timestamp}-${random}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName:  cleanName,
        customerPhone: cleanPhone,
        address:       cleanAddress,
        totalAmount:   parsedTotal,
        paymentMethod: cleanPayment,
        // SECURITY: userId is sourced from the authenticated JWT, not the request body
        userId: authenticatedUserId,
        items: {
          create: items.map((item) => ({
            productId:   sanitizeStr(item.productId, 128),
            quantity:    sanitizeInt(item.quantity, 1, 9999),
            price:       sanitizeFloat(item.price, 0),
            variantSize: typeof item.variantSize === 'string' ? sanitizeStr(item.variantSize, 50) : 'Base',
          })),
        },
      },
      include: { items: true },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('createOrder error:', error);
    return res.status(400).json({ message: 'Failed to create order' });
  }
};

// ---------------------------------------------------------------
// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
// ---------------------------------------------------------------
exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(orders);
  } catch (error) {
    console.error('getOrders error:', error);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// ---------------------------------------------------------------
// @desc    Update Order Status (Admin)
// @route   PUT /api/orders/admin/:id
// @access  Private/Admin
// ---------------------------------------------------------------
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // SANITIZE: route param id
    const id = sanitizeStr(req.params.id, 128);
    if (!id) return res.status(400).json({ message: 'Invalid order ID' });

    // Validate status against whitelist to prevent arbitrary data injection
    if (!status || !ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${ALLOWED_ORDER_STATUSES.join(', ')}`,
      });
    }

    // SECURITY: Verify the order exists before mutating — prevents Prisma error leaks
    const existing = await prisma.order.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return res.status(404).json({ message: 'Order not found' });

    const order = await prisma.order.update({ where: { id }, data: { status } });
    return res.json(order);
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return res.status(400).json({ message: 'Failed to update order status' });
  }
};

// ---------------------------------------------------------------
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private (User)
// ---------------------------------------------------------------
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(orders);
  } catch (error) {
    console.error('getMyOrders error:', error);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// ---------------------------------------------------------------
// @desc    Update Order Details (Admin Notes & Shipping Info)
// @route   PUT /api/orders/admin/:id/details
// @access  Private/Admin
// ---------------------------------------------------------------
exports.updateOrderDetails = async (req, res) => {
  try {
    // SANITIZE: route param id
    const id = sanitizeStr(req.params.id, 128);
    if (!id) return res.status(400).json({ message: 'Invalid order ID' });

    const { adminNotes, courierName, trackingId, estimatedDelivery, status } = req.body;

    // SECURITY: Verify the order exists before mutating — prevents Prisma error leaks
    const existing = await prisma.order.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return res.status(404).json({ message: 'Order not found' });

    const updateData = {};
    if (adminNotes        !== undefined) updateData.adminNotes    = sanitizeStr(adminNotes, 2000);
    if (courierName       !== undefined) updateData.courierName   = sanitizeStr(courierName, 100);
    if (trackingId        !== undefined) updateData.trackingId    = sanitizeStr(trackingId, 100);
    if (estimatedDelivery !== undefined) {
      if (estimatedDelivery) {
        const d = new Date(estimatedDelivery);
        if (isNaN(d.getTime())) return res.status(400).json({ message: 'Invalid estimated delivery date' });
        updateData.estimatedDelivery = d;
      } else {
        updateData.estimatedDelivery = null;
      }
    }
    if (status !== undefined) {
      if (!ALLOWED_ORDER_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      updateData.status = status;
    }

    const order = await prisma.order.update({ where: { id }, data: updateData });
    return res.json(order);
  } catch (error) {
    console.error('updateOrderDetails error:', error);
    return res.status(400).json({ message: 'Failed to update order details' });
  }
};

// ---------------------------------------------------------------
// @desc    Upload Invoice PDF
// @route   POST /api/orders/admin/:id/invoice
// @access  Private/Admin
// ---------------------------------------------------------------
exports.uploadInvoice = async (req, res) => {
  try {
    // SANITIZE: route param id
    const id = sanitizeStr(req.params.id, 128);
    if (!id) return res.status(400).json({ message: 'Invalid order ID' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // SECURITY: Verify the order exists before mutating — prevents Prisma error leaks
    const existing = await prisma.order.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return res.status(404).json({ message: 'Order not found' });

    const invoiceUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    const order = await prisma.order.update({ where: { id }, data: { invoiceUrl } });
    return res.json(order);
  } catch (error) {
    console.error('uploadInvoice error:', error);
    return res.status(400).json({ message: 'Failed to upload invoice' });
  }
};
