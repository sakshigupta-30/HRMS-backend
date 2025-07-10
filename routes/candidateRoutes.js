const express = require('express');
const router = express.Router();

const candidateController = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');

// ✅ Protect all routes with protect middleware
router.get('/', protect, candidateController.getCandidates);
router.get('/:id', protect, candidateController.getCandidateById);
router.post('/', protect, candidateController.addCandidate);
router.put('/:id', protect, candidateController.updateCandidate);
router.delete('/:id', protect, candidateController.deleteCandidate);

module.exports = router;