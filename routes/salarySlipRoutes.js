const express = require('express');
const router = express.Router();
const salarySummaryController = require('../controllers/salarySummaryController');

router.post('/', salarySummaryController.saveSalarySummary);
router.get('/', salarySummaryController.getSalarySummary);

module.exports = router;
