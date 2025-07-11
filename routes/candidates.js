const express = require('express');
const {
  getCandidates,
  getCandidateById,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,       // ✅ NEW
  getEmployees                 // ✅ NEW
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

// ✅ Add these routes at the end
router.get('/employees', getEmployees);
router.put('/:id/status', updateCandidateStatus);

module.exports = router;
