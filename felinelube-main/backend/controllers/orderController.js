const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Whitelist of allowed order statuses
const ALLOWED_ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// Helper: sanitize string input
const sanitizeStr = (val, maxLen = 500) =>
  typeof val === 'string' ? val.trim().slice(0, maxLen) : undefined;

// ---------------------------------------------------------------
// @desc    Create new order
// @route   POST /api/orders
// @access  Public (guest checkout)
// ---------------------------------------------------------------
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, address, totalAmount, items, paymentMethod, userId } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !address || !totalAmount || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    // Validate and sanitize scalar fields
    const parsedTotal = parseFloat(totalAmount);
    if (isNaN(parsedTotal) || parsedTotal <= 0) {
      return res.status(400).json({ message: 'Invalid order total' });
    }

    // Limit order items to a reasonable count to prevent resource abuse
    if (items.length > 50) {
      return res.status(400).json({ message: 'Order contains too many items' });
    }

    // Validate each order item
    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      const price = parseFloat(item.price);
      if (!item.productId || typeof item.productId !== 'string') {
        return res.status(400).json({ message: 'Invalid product reference in order' });
      }
      if (isNaN(qty) || qty <= 0 || qty > 9999) {
        return res.status(400).json({ message: 'Invalid item quantity' });
      }
      if (isNaN(price) || price < 0) {
        return res.status(400).json({ message: 'Invalid item price' });
      }
    }

    // Generate a cryptographically more unique order number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `FEL-${timestamp}-${random}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: sanitizeStr(customerName, 150),
        customerPhone: sanitizeStr(customerPhone, 30),
        address: sanitizeStr(address, 500),
        totalAmount: parsedTotal,
        paymentMethod: sanitizeStr(paymentMethod, 50),
        // Only link to userId if it is a valid string (not injected null/object)
        userId: (typeof userId === 'string' && userId.length > 0) ? userId : null,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: parseInt(item.quantity, 10),
            price: parseFloat(item.price),
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
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Validate status against whitelist to prevent arbitrary data injection
    if (!status || !ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${ALLOWED_ORDER_STATUSES.join(', ')}`,
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

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
