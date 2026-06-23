const prisma = require('../config/db');
const { sanitizeStr } = require('../utils/sanitize');

// Whitelist of allowed setting keys — prevents writing to arbitrary DB records
const ALLOWED_SETTING_KEYS = [
  'maintenance_mode', 'site_announcement', 'contact_email',
  'whatsapp_number', 'free_shipping_threshold', 'currency',
  'site_name', 'site_description',
];

// @desc    Get all settings
// @route   GET /api/settings/admin/all
// @access  Private (Admin)
const getSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    res.json(settings);
  } catch (error) {
    console.error('getSettings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a setting
// @route   PUT /api/settings/admin/:key
// @access  Private (Admin)
const updateSetting = async (req, res) => {
  try {
    // SANITIZE: key route param — only allow whitelisted keys
    const key = req.params.key;
    if (!key || !ALLOWED_SETTING_KEYS.includes(key)) {
      return res.status(400).json({
        message: `Invalid setting key. Must be one of: ${ALLOWED_SETTING_KEYS.join(', ')}`,
      });
    }

    const { value } = req.body;

    // SANITIZE: value — must be a string or number, capped at 1000 chars
    if (value === undefined || value === null) {
      return res.status(400).json({ message: 'Setting value is required' });
    }
    const cleanValue = sanitizeStr(String(value), 1000);
    if (cleanValue === undefined) {
      return res.status(400).json({ message: 'Invalid setting value' });
    }

    const updatedSetting = await prisma.setting.upsert({
      where:  { key },
      update: { value: cleanValue },
      create: { key, value: cleanValue },
    });

    res.json(updatedSetting);
  } catch (error) {
    console.error('updateSetting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Public settings (e.g. maintenance mode)
const getPublicSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    res.json(settings);
  } catch (error) {
    console.error('getPublicSettings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSettings,
  updateSetting,
  getPublicSettings
};
