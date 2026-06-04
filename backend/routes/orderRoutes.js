const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

// Public
router.post('/', createOrder);

// Admin
router.get('/admin/all', getOrders);
router.put('/admin/:id', updateOrderStatus);

module.exports = router;
