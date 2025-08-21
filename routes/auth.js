const express = require('express');
const { register, login, getProfile, validateNumber } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/validate-phone', validateNumber);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;