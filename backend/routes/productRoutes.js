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

// Public Routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin Routes (Add auth middleware later)
router.get('/admin/all', adminGetProducts);
router.post('/admin', createProduct);
router.put('/admin/:id', updateProduct);
router.delete('/admin/:id', deleteProduct);

module.exports = router;
