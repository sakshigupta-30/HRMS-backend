const express = require('express');
const {
  createAdvancePayment,
  getAdvancePayments,
} = require('../controllers/advancePaymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Route to create a new advance payment
router.post('/', protect, authorize('admin'), createAdvancePayment);

// Route to get all advance payments
router.get('/', protect, authorize('admin'), getAdvancePayments);

module.exports = router;