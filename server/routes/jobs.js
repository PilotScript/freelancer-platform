const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobs');

// Include proposal routes
const proposalRouter = require('./proposals');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:jobId/proposals', proposalRouter);

router
  .route('/')
  .get(getJobs)
  .post(protect, authorize('client', 'admin'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('client', 'admin'), updateJob)
  .delete(protect, authorize('client', 'admin'), deleteJob);

module.exports = router;
