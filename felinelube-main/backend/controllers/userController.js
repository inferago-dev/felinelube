const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
      include: {
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
const adminUpdateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, banReason } = req.body; // status: ACTIVE, BANNED, SUSPENDED

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status,
        banReason: status === 'BANNED' || status === 'SUSPENDED' ? banReason : null
      }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserNotifications,
  adminGetUsers,
  adminUpdateUserStatus
};
