const prisma = require('../config/db');

// @desc    Get all homepage sections
// @route   GET /api/homepage/admin/all
// @access  Private (Admin)
const getHomepageSections = async (req, res) => {
  try {
    const sections = await prisma.homepageContent.findMany();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a homepage section
// @route   PUT /api/homepage/admin/:section
// @access  Private (Admin)
const updateHomepageSection = async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;

    const updatedSection = await prisma.homepageContent.upsert({
      where: { section },
      update: { content },
      create: { section, content }
    });

    res.json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public endpoint to get all
const getPublicHomepageSections = async (req, res) => {
  try {
    const sections = await prisma.homepageContent.findMany();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHomepageSections,
  updateHomepageSection,
  getPublicHomepageSections
};
