const express = require('express');
const router = express.Router();
const { getSettings, updateSetting, getPublicSettings } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/public', getPublicSettings);

router.get('/admin/all', protect, admin, getSettings);
router.put('/admin/:key', protect, admin, updateSetting);

module.exports = router;
