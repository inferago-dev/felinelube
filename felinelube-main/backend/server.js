const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(xss());
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:3000',   // fallback
    'https://felinelube.onrender.com', // production frontend
    'https://felinelube.vercel.app'    // vercel frontend
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Feline Admin API is running' });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
