const express = require('express');
const multer = require('multer');

const {
  getCandidates,
  getCandidateById,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,
  getEmployees,
  bulkUploadCandidates,
} = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Multer setup to handle in-memory file upload for bulk upload
const upload = multer({ storage: multer.memoryStorage() });

// All routes require authentication
router.use(protect);

// Special routes before param-based routes
router.get('/employees', getEmployees); // must come before /:id
router.put('/:id/status', updateCandidateStatus);

// Bulk upload route - accepts single file upload with key 'file'
router.post('/bulk-upload', upload.single('file'), bulkUploadCandidates);

// Main routes
router.route('/')
  .get(getCandidates)
  .post(addCandidate);

router.route('/:id')
  .get(getCandidateById)
  .put(updateCandidate)
  .delete(authorize('admin', 'hr'), deleteCandidate);

module.exports = router;
