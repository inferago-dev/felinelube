const express = require('express');
const router = express.Router();
const { getHomepageSections, updateHomepageSection, getPublicHomepageSections } = require('../controllers/homepageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/public', getPublicHomepageSections);

router.get('/admin/all', protect, admin, getHomepageSections);
router.put('/admin/:section', protect, admin, updateHomepageSection);

module.exports = router;
