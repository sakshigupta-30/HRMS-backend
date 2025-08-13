const express = require('express');
const router = express.Router();
const salarySummaryController = require('../controllers/salarySummaryController');

router.post('/', salarySummaryController.saveSalarySummary);
router.get('/', salarySummaryController.getSalarySummary);
router.get('/all', salarySummaryController.getSalarySummariesByMonth);

module.exports = router;
