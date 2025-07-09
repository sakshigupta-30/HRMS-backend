require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// ✅ Clean CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://hrms-dashboard-six.vercel.app'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ allow request
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


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

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
