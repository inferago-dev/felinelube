const express = require('express');
const router = express.Router();
const { submitEnquiry } = require('../controllers/enquiryController');
const rateLimit = require('express-rate-limit');

// Rate limit: Max 5 enquiries per 15 minutes
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many submissions, please try again later.' },
});

router.post('/', enquiryLimiter, submitEnquiry);

module.exports = router;
