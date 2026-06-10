const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

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

      // Validate decoded id exists and is a non-empty string
      if (!decoded || !decoded.id || typeof decoded.id !== 'string') {
        return res.status(401).json({ message: 'Not authorized, invalid token payload' });
      }

      // Check if it's an Admin first
      let user = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true },
      });
      let userType = 'admin';

      if (!user) {
        // If not admin, check if it's a standard User
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true, status: true },
        });
        userType = 'user';
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Check user status if it's a standard user
      if (userType === 'user' && user.status !== 'ACTIVE') {
        return res.status(403).json({ message: 'Account is suspended' });
      }

      // Attach minimal user details to request (never attach password)
      req.user = user;
      req.userType = userType;
      return next();
    } catch (error) {
      // Do not leak JWT error details to the client
      console.error('Auth middleware token verification failed:', error.name);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.userType === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as an admin' });
};

module.exports = { protect, admin };
