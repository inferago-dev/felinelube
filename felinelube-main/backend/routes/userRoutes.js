const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserNotifications } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/notifications', protect, getUserNotifications);

module.exports = router;
