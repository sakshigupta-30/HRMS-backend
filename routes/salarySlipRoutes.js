const express = require('express');
const router = express.Router();
const salarySummaryController = require('../controllers/salarySummaryController');

router.post('/salarysummary', salarySummaryController.saveSalarySummary);
router.get('/salarysummary', salarySummaryController.getSalarySummary);

module.exports = router;
