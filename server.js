require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Log incoming origins
app.use((req, res, next) => {
  console.log('🌐 Incoming Origin:', req.headers.origin);
  next();
});

// ✅ Allowed origins list
const allowedOrigins = [
  'http://localhost:5173',
  'https://hrms-dashboard-six.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined

// ✅ Simple CORS setup with preflight support
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Handle preflight (OPTIONS) requests
app.options('*', cors());

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(error => console.error('❌ MongoDB connection failed:', error.message));

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.get('/', (req, res) => {
  res.send('Welcome to HRMS Backend!');
});

// ✅ CORS test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'CORS test successful!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
