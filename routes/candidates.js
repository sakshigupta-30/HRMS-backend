const express = require('express');
const {
  getCandidates,
  getCandidateById,
  addCandidate,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getCandidates)
  .post(addCandidate);

router.route('/:id')
  .get(getCandidateById)
  .put(updateCandidate)
  .delete(authorize('admin', 'hr'), deleteCandidate);

module.exports = router;