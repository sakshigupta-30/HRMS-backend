require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// ✅ Simplified CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://hrms-dashboard-six.vercel.app',
  'https://hrms-dashboard-six.vercel.app/',
  process.env.FRONTEND_URL,
  // For development
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

// Simple CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  console.log('🔍 CORS: Request from origin:', origin);
  
  // Set basic CORS headers
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS: Handling preflight OPTIONS request');
    res.status(200).end();
    return;
  }
  
  next();
});

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

// Test endpoint for CORS
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'CORS test successful!', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
