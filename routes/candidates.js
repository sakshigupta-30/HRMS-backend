const express = require('express');
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getCandidates)
  .post(createCandidate);

router.route('/:id')
  .get(getCandidate)
  .put(updateCandidate)
  .delete(authorize('admin', 'hr'), deleteCandidate);

module.exports = router;