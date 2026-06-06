const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductBySlug, 
  adminGetProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin Routes (Protected)
router.get('/admin/all', protect, admin, adminGetProducts);
router.post('/admin', protect, admin, createProduct);
router.put('/admin/:id', protect, admin, updateProduct);
router.delete('/admin/:id', protect, admin, deleteProduct);

module.exports = router;
