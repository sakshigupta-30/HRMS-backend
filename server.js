require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://hrms-dashboard-six.vercel.app' // ✅ your Vercel URL here
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';
mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(error => console.error('MongoDB connection failed:', error.message));

// Routes
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to HRMS Backend!');
});

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

