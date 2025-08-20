const express = require('express');
const {
  createAdvancePayment,
  getAdvancePayments,
  getAllAdvancePaymentsByCode,
  getAllAdvancePaymentsByMonth,
} = require('../controllers/advancedPaymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Route to create a new advance payment
router.post('/', protect , createAdvancePayment);

// Route to get all advance payments
router.get('/', protect, getAdvancePayments);
router.get('/all', protect, getAllAdvancePaymentsByCode);
router.get('/month', protect, getAllAdvancePaymentsByMonth);

module.exports = router;