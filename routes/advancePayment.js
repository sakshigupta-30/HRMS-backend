const express = require('express');
const {
  createAdvancePayment,
  getAdvancePayments,
} = require('../controllers/advancedPaymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Route to create a new advance payment
router.post('/', protect , createAdvancePayment);

// Route to get all advance payments
router.get('/', protect, getAdvancePayments);

module.exports = router;