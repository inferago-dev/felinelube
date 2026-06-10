const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all settings
// @route   GET /api/settings/admin/all
// @access  Private (Admin)
const getSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a setting
// @route   PUT /api/settings/admin/:key
// @access  Private (Admin)
const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const updatedSetting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });

    res.json(updatedSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public settings (e.g. maintenance mode)
const getPublicSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSetting,
  getPublicSettings
};
