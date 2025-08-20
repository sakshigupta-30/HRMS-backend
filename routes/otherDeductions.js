const express = require('express');
const { protect } = require('../middleware/auth');
const { createOtherDeductions, getOtherDeductions, getAllOtherDeductionsByCode, getAllOtherDeductionsByMonth } = require('../controllers/OtherDeductionController');

const router = express.Router();

// Route to create a new advance payment
router.post('/', protect , createOtherDeductions);

// Route to get all advance payments
router.get('/', protect, getOtherDeductions);
router.get('/all', protect, getAllOtherDeductionsByCode);
router.get('/month', protect, getAllOtherDeductionsByMonth);

module.exports = router;