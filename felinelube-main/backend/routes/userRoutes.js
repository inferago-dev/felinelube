const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserNotifications, adminGetUsers, adminUpdateUserStatus } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/notifications', protect, getUserNotifications);

// Admin routes
router.get('/admin/all', protect, admin, adminGetUsers);
router.put('/admin/:id/status', protect, admin, adminUpdateUserStatus);

module.exports = router;
