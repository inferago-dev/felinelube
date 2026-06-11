const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

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

// Helper: sanitize a string (trim, lowercase email)
const sanitizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');
const sanitizeName  = (name)  => (typeof name  === 'string' ? name.trim().slice(0, 100) : '');

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
      data: { name: cleanName, email: cleanEmail, password: hashedPassword },
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
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

module.exports = { registerUser, loginUser, registerAdmin, loginAdmin };
