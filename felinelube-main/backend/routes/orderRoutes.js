const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createOrder, getOrders, updateOrderStatus, getMyOrders, updateOrderDetails, uploadInvoice } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `invoice-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max for invoices (PDF)
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/pdf';
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invoices must be PDF or Images!'));
    }
  }
});

// Public
router.post('/', createOrder);

// User
router.get('/myorders', protect, getMyOrders);

// Admin
router.get('/admin/all', protect, admin, getOrders);
router.put('/admin/:id', protect, admin, updateOrderStatus);
router.put('/admin/:id/details', protect, admin, updateOrderDetails);
router.post('/admin/:id/invoice', protect, admin, upload.single('invoice'), uploadInvoice);

module.exports = router;
