const prisma = require('../config/db');
const { sanitizeStr, sanitizeEmail, isValidEmail } = require('../utils/sanitize');

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

    // SANITIZE: all fields via central utility
    const cleanName    = sanitizeStr(name, 100);
    const cleanEmail   = sanitizeEmail(email);
    const cleanMessage = sanitizeStr(message, 1000);

    if (!cleanName)  return res.status(400).json({ message: 'Invalid name.' });
    if (!isValidEmail(cleanEmail)) return res.status(400).json({ message: 'Invalid email format.' });
    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters.' });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name:    cleanName,
        email:   cleanEmail,
        message: cleanMessage,
      }
    });

    return res.status(201).json({ message: 'Enquiry submitted successfully!', id: enquiry.id });
  } catch (error) {
    console.error('submitEnquiry error:', error);
    return res.status(500).json({ message: 'Failed to submit enquiry' });
  }
};
