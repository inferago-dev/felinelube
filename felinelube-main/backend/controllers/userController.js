const prisma = require('../config/db');
const {
  sanitizeStr, sanitizeEmail, isValidEmail, isValidMalaysianPhone
} = require('../utils/sanitize');

// Allowed user statuses — whitelist to prevent arbitrary string injection
const ALLOWED_USER_STATUSES = ['ACTIVE', 'BANNED', 'SUSPENDED'];

// @desc    Get user profile & notifications
// @route   GET /api/users/profile
// @access  Private (User)
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        notifications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('getUserProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // SANITIZE: name
    const cleanName = name ? sanitizeStr(name, 100) : undefined;

    // SANITIZE + validate phone
    let cleanPhone = undefined;
    if (phone) {
      cleanPhone = sanitizeStr(phone, 30);
      if (!cleanPhone || !isValidMalaysianPhone(cleanPhone)) {
        return res.status(400).json({ message: 'Invalid Malaysia phone number format' });
      }
    }

    // SANITIZE: address
    const cleanAddress = address ? sanitizeStr(address, 500) : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name:    cleanName,
        phone:   cleanPhone,
        address: cleanAddress,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('updateUserProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private (User)
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (error) {
    console.error('getUserNotifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users for admin
// @route   GET /api/users/admin/all
// @access  Private (Admin)
const adminGetUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      // SECURITY: Explicitly select only safe fields — never expose password hash,
      // resetToken, or resetTokenExpiry to any caller, even admins.
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        status: true,
        banReason: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('adminGetUsers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user status (ban/suspend/activate)
// @route   PUT /api/users/admin/:id/status
// @access  Private (Admin)
const adminUpdateUserStatus = async (req, res) => {
  try {
    // SANITIZE: route param id
    const id = sanitizeStr(req.params.id, 128);
    if (!id) return res.status(400).json({ message: 'Invalid user ID' });

    const { status, banReason } = req.body;

    // SECURITY: Validate status against whitelist — prevents arbitrary status injection
    if (!status || !ALLOWED_USER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${ALLOWED_USER_STATUSES.join(', ')}`,
      });
    }

    // SANITIZE: banReason
    const cleanBanReason = banReason ? sanitizeStr(banReason, 500) : null;

    // SECURITY: Verify the user exists before mutating — prevents Prisma error leaks
    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status,
        banReason: (status === 'BANNED' || status === 'SUSPENDED') ? cleanBanReason : null
      },
      select: {
        id: true, name: true, email: true,
        status: true, banReason: true, updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('adminUpdateUserStatus error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
};

// @desc    Get public statistics
// @route   GET /api/users/public-stats
// @access  Public
const getPublicStats = async (req, res) => {
  try {
    const registeredCount = await prisma.user.count();
    const hour = new Date().getHours();
    const activeViewers  = 8  + ((hour * 7) % 17);
    const activeLoggedIn = 3  + ((hour * 3) % 8);

    res.json({
      registeredCount: registeredCount || 150,
      activeViewers,
      activeLoggedIn
    });
  } catch (error) {
    console.error('getPublicStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserNotifications,
  adminGetUsers,
  adminUpdateUserStatus,
  getPublicStats
};
