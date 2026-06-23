const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const crypto = require('crypto');
const { sendPasswordReset } = require('../utils/emailService');
const { sanitizeEmail, sanitizeStr, isValidEmail } = require('../utils/sanitize');

// ============================================================
// SECURITY: JWT_SECRET MUST come from environment variable.
// If it is missing, crash the server at startup — do NOT
// silently fall back to a hardcoded string in production.
// ============================================================
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

// Strong JWT expiry — 7 days (down from 30 days to reduce token exposure window)
const JWT_EXPIRY = '7d';

// Helper: generate a signed JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

// sanitizeEmail and sanitizeStr are imported from utils/sanitize
// (sanitizeName is an alias for sanitizeStr with a 100-char cap)
const sanitizeName = (name) => sanitizeStr(name, 100) || '';

// ---------------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ---------------------------------------------------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const cleanEmail = sanitizeEmail(email);
    const cleanName  = sanitizeName(name);

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Password strength: minimum 8 chars
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (userExists) {
      // Return same generic message to prevent user-enumeration
      return res.status(400).json({ message: 'Registration failed. Please try again.' });
    }

    // Hash password with cost factor 12 (stronger than default 10)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name: cleanName, email: cleanEmail, password: hashedPassword, isVerified: true },
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      token: generateToken(user.id),
      message: 'Registration successful.'
    });
  } catch (error) {
    // Never leak internal error details to the client
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// ---------------------------------------------------------------
// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
// ---------------------------------------------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = sanitizeEmail(email);

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    // Use bcrypt.compare even when user is not found (prevents timing attack)
    const dummyHash = '$2a$12$dummyhashfordummycomparison000000000000000000000000000';
    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummyHash);

    if (!passwordMatch || !user) {
      // Single generic error message — never reveal whether email exists
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: 'Account is suspended' });
    }



    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// ---------------------------------------------------------------
// @desc    Register a new admin
// @route   POST /api/auth/admin/register
// @access  Private — protected by ADMIN_REGISTER_SECRET header
// ---------------------------------------------------------------
const registerAdmin = async (req, res) => {
  try {
    // SECURITY: Admin self-registration must be gated by a secret key
    // Set ADMIN_REGISTER_SECRET in your Render environment variables.
    const adminRegisterSecret = process.env.ADMIN_REGISTER_SECRET;
    if (!adminRegisterSecret) {
      return res.status(503).json({ message: 'Admin registration is disabled' });
    }

    const providedSecret = req.headers['x-admin-secret'];
    if (!providedSecret || providedSecret !== adminRegisterSecret) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const cleanEmail = sanitizeEmail(email);
    const cleanName  = sanitizeName(name);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (password.length < 12) {
      return res.status(400).json({ message: 'Admin password must be at least 12 characters' });
    }

    const adminExists = await prisma.admin.findUnique({ where: { email: cleanEmail } });
    if (adminExists) {
      return res.status(400).json({ message: 'Registration failed' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: { name: cleanName, email: cleanEmail, password: hashedPassword, role: 'ADMIN' },
    });

    return res.status(201).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin.id),
    });
  } catch (error) {
    console.error('Register admin error:', error);
    return res.status(500).json({ message: 'Server error during admin registration' });
  }
};

// ---------------------------------------------------------------
// @desc    Authenticate an admin
// @route   POST /api/auth/admin/login
// @access  Public
// ---------------------------------------------------------------
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = sanitizeEmail(email);

    const admin = await prisma.admin.findUnique({ where: { email: cleanEmail } });

    // Timing-safe comparison even when admin not found
    const dummyHash = '$2a$12$dummyhashfordummycomparison000000000000000000000000000';
    const passwordMatch = admin
      ? await bcrypt.compare(password, admin.password)
      : await bcrypt.compare(password, dummyHash);

    if (!passwordMatch || !admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin.id),
    });
  } catch (error) {
    console.error('Login admin error:', error);
    return res.status(500).json({ message: 'Server error during admin login' });
  }
};



// ---------------------------------------------------------------
// @desc    Forgot Password - Send Reset Link
// @route   POST /api/auth/forgot-password
// @access  Public
// ---------------------------------------------------------------
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide an email' });

    const cleanEmail = sanitizeEmail(email);
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return res.status(200).json({ message: 'If an account exists, a reset link will be sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    await sendPasswordReset(user.email, resetToken);

    return res.status(200).json({ message: 'If an account exists, a reset link will be sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------------------------
// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
// ---------------------------------------------------------------
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password required' });

    if (newPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
    });

    return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------------------------
// @desc    Change Password (Logged In)
// @route   PUT /api/auth/change-password
// @access  Private
// ---------------------------------------------------------------
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required' });
    if (newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  registerUser, loginUser, registerAdmin, loginAdmin, 
  forgotPassword, resetPassword, changePassword 
};
