const express = require('express');
const {
  getCandidates,
  getCandidateById,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,
  getEmployees
} = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ✅ All routes require authentication
router.use(protect);

// ✅ Special routes should come before param-based routes
router.get('/employees', getEmployees); // 👈 this must come before `/:id`
router.put('/:id/status', updateCandidateStatus);

// ✅ Main routes
router.route('/')
  .get(getCandidates)
  .post(addCandidate);

router.route('/:id')
  .get(getCandidateById)
  .put(updateCandidate)
  .delete(authorize('admin', 'hr'), deleteCandidate);

module.exports = router;
