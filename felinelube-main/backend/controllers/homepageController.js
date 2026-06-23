const prisma = require('../config/db');
const { sanitizeStr } = require('../utils/sanitize');

// Whitelist of valid homepage section names to prevent arbitrary DB writes
const ALLOWED_SECTIONS = ['Hero', 'About', 'Features', 'CTA', 'Footer', 'Banner', 'Announcement'];

// @desc    Get all homepage sections
// @route   GET /api/homepage/admin/all
// @access  Private (Admin)
const getHomepageSections = async (req, res) => {
  try {
    const sections = await prisma.homepageContent.findMany();
    res.json(sections);
  } catch (error) {
    console.error('getHomepageSections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a homepage section
// @route   PUT /api/homepage/admin/:section
// @access  Private (Admin)
const updateHomepageSection = async (req, res) => {
  try {
    // SANITIZE: section route param — only allow whitelisted section names
    const section = req.params.section;
    if (!section || !ALLOWED_SECTIONS.includes(section)) {
      return res.status(400).json({
        message: `Invalid section. Must be one of: ${ALLOWED_SECTIONS.join(', ')}`,
      });
    }

    const { content } = req.body;

    // SANITIZE: content must be a plain object (not arbitrary strings or arrays)
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      return res.status(400).json({ message: 'Content must be a plain object' });
    }

    // SANITIZE: sanitize each string field inside the content object
    const cleanContent = {};
    for (const [key, val] of Object.entries(content)) {
      // Only allow string values — skip non-strings silently
      if (typeof val === 'string') {
        cleanContent[sanitizeStr(key, 100)] = sanitizeStr(val, 2000);
      }
    }

    const updatedSection = await prisma.homepageContent.upsert({
      where:  { section },
      update: { content: cleanContent },
      create: { section, content: cleanContent },
    });

    res.json(updatedSection);
  } catch (error) {
    console.error('updateHomepageSection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Public endpoint to get all
const getPublicHomepageSections = async (req, res) => {
  try {
    const sections = await prisma.homepageContent.findMany();
    res.json(sections);
  } catch (error) {
    console.error('getPublicHomepageSections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getHomepageSections,
  updateHomepageSection,
  getPublicHomepageSections
};
