const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, getMyOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public
router.post('/', createOrder);

// User
router.get('/myorders', protect, getMyOrders);

// Admin
router.get('/admin/all', protect, admin, getOrders);
router.put('/admin/:id', protect, admin, updateOrderStatus);

module.exports = router;
