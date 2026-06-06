const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public
router.post('/', createOrder);

// Admin
router.get('/admin/all', protect, admin, getOrders);
router.put('/admin/:id', protect, admin, updateOrderStatus);

module.exports = router;
