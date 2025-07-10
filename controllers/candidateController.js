const express = require('express');
const router = express.Router();

const candidateController = require('../controllers/candidateController');
const { verifyToken } = require('../middleware/authMiddleware');

// ✅ Protect all routes with verifyToken middleware
router.get('/', verifyToken, candidateController.getCandidates);
router.get('/:id', verifyToken, candidateController.getCandidateById);
router.post('/', verifyToken, candidateController.addCandidate);
router.put('/:id', verifyToken, candidateController.updateCandidate);
router.delete('/:id', verifyToken, candidateController.deleteCandidate);

module.exports = router;
