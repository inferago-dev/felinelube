const prisma = require('../config/db');
const xss = require('xss');

// ---------------------------------------------------------------
// @desc    Submit new Enquiry
// @route   POST /api/enquiries
// @access  Public
// ---------------------------------------------------------------
exports.submitEnquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message.' });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (message.length < 10 || message.length > 1000) {
      return res.status(400).json({ message: 'Message must be between 10 and 1000 characters.' });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: xss(name.trim().slice(0, 100)),
        email: email.trim().toLowerCase(),
        message: xss(message.trim())
      }
    });

    // Optional: Add Telegram logic here if needed in the future
    
    return res.status(201).json({ message: 'Enquiry submitted successfully!', id: enquiry.id });
  } catch (error) {
    console.error('submitEnquiry error:', error);
    return res.status(500).json({ message: 'Failed to submit enquiry' });
  }
};
