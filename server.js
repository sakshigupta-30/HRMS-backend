require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// ✅ Bulletproof CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  console.log('🔍 CORS: Method:', req.method, 'Origin:', origin);
  console.log('🔍 CORS: URL:', req.url);
  
  // Set CORS headers for all requests
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '600'); // 10 minutes
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS: Preflight request handled');
    res.status(200).send();
    return;
  }
  
  console.log('✅ CORS: Headers set for', req.method, 'request');
  next();
});

// Add additional CORS middleware as backup
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

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
