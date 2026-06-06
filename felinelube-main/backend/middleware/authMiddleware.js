const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'feline_secret_key_123';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if it's an Admin first
      let user = await prisma.admin.findUnique({
        where: { id: decoded.id },
      });
      let userType = 'admin';

      if (!user) {
        // If not admin, check if it's a standard User
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });
        userType = 'user';
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Check user status if it's a standard user
      if (userType === 'user' && user.status !== 'ACTIVE') {
        return res.status(403).json({ message: `Account is ${user.status.toLowerCase()}` });
      }

      // Attach user details to request
      req.user = user;
      req.userType = userType;
      next();
    } catch (error) {
      console.error('Auth middleware token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.userType === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
