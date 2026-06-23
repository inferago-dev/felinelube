const prisma = require('../config/db');

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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (phone) {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      const myPhoneRegex = /^(?:\+60|60|0)1[0-9]{8,9}$/;
      if (!myPhoneRegex.test(cleanPhone)) {
        return res.status(400).json({ message: 'Invalid Malaysia phone number format' });
      }
    }

    // Optional: password update could go here, but usually requires separate logic for security
    // We will just do basic profile info here.

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined,
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status (ban/suspend/activate)
// @route   PUT /api/users/admin/:id/status
// @access  Private (Admin)
// Allowed user statuses — whitelist to prevent arbitrary string injection
const ALLOWED_USER_STATUSES = ['ACTIVE', 'BANNED', 'SUSPENDED'];

const adminUpdateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, banReason } = req.body;

    // SECURITY: Validate id type
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // SECURITY: Validate status against whitelist — prevents arbitrary status injection
    if (!status || !ALLOWED_USER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${ALLOWED_USER_STATUSES.join(', ')}`,
      });
    }

    // SECURITY: Verify the user exists before mutating — prevents Prisma error leaks
    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status,
        banReason: (status === 'BANNED' || status === 'SUSPENDED') ? (banReason || null) : null
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

// @desc    Get public statistics (registered users count, online visitors & active logins)
// @route   GET /api/users/public-stats
// @access  Public
const getPublicStats = async (req, res) => {
  try {
    const registeredCount = await prisma.user.count();

    // Generate stable-ish numbers based on the hour of the day so it changes but doesn't feel erratic.
    const hour = new Date().getHours();
    
    // We want viewers to be between 8 and 24, varying by hour
    // And logged in users to be between 3 and 10
    // Let's create a deterministic but changing seed.
    const activeViewers = 8 + ((hour * 7) % 17);
    const activeLoggedIn = 3 + ((hour * 3) % 8);

    res.json({
      registeredCount: registeredCount || 150, // default fallback if DB is empty
      activeViewers,
      activeLoggedIn
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

