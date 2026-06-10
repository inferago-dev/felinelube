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
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/pdf';
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Images and PDFs only!');
    }
  }
});

// Public Routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin Routes (Protected)
router.get('/admin/all', protect, admin, adminGetProducts);
router.post('/admin', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), createProduct);
router.put('/admin/:id', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), updateProduct);
router.delete('/admin/:id', protect, admin, deleteProduct);

module.exports = router;
