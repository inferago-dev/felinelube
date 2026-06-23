const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// ============================================================
// SECURITY: Crash immediately if critical env vars are absent
// ============================================================
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Refusing to start.');
  process.exit(1);
}

const app = express();

// ----------------------------------------------------------
// Security HTTP headers via Helmet (CSP, HSTS, etc.)
// ----------------------------------------------------------
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ----------------------------------------------------------
// CORS: only allow known origins
// ----------------------------------------------------------
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('192.168.') ||
      origin.includes('felinelube.onrender.com') ||
      origin.includes('felinelube.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));
// ----------------------------------------------------------
// JSON body parser with a size limit to prevent payload flood
// MUST come BEFORE the XSS sanitizer so the body is already
// parsed as an object when sanitizeBody runs.
// ----------------------------------------------------------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ----------------------------------------------------------
// XSS: sanitize all string values in request body
// (runs after JSON parsing so req.body is populated)
// ----------------------------------------------------------
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const clean = (obj) => {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
          obj[key] = xss(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          clean(obj[key]);
        }
      }
    };
    clean(req.body);
  }
  next();
};
app.use(sanitizeBody);

// ----------------------------------------------------------
// Rate limiting: 100 requests per IP per 15 minutes (global)
// ----------------------------------------------------------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

// Stricter limiter for auth endpoints — 15 attempts per 15 min per IP
// SECURITY: This MUST remain active in production to block brute-force attacks.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
  skipSuccessfulRequests: true, // only count failed/errored requests
});
app.use('/api/auth/', authLimiter);

// ----------------------------------------------------------
// Static uploads directory
// ----------------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------------------------------------------------
// Routes
// ----------------------------------------------------------
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const homepageRoutes = require('./routes/homepageRoutes');
const settingRoutes = require('./routes/settingRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/enquiries', enquiryRoutes);

// ----------------------------------------------------------
// Health check (no sensitive info exposed)
// ----------------------------------------------------------
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// ----------------------------------------------------------
// 404 catch-all
// ----------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ----------------------------------------------------------
// Global error handler (never leak stack traces)
// ----------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ----------------------------------------------------------
// Start server
// ----------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
