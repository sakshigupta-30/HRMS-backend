const express = require('express');
const router = express.Router();
const { addCandidate, getCandidates, getCandidateById, updateCandidate, deleteCandidate } = require('../controllers/candidateController');
const { protect } = require('../controllers/authController');

// All routes are protected (require authentication)
router.use(protect);

// Add a new candidate
router.post('/', addCandidate);

// Get all candidates
router.get('/', getCandidates);

// Get a single candidate
router.get('/:id', getCandidateById);

// Update a candidate
router.put('/:id', updateCandidate);

// Delete a candidate
router.delete('/:id', deleteCandidate);

module.exports = router;
