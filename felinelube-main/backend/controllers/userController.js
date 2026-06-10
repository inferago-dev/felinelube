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

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserNotifications
};
