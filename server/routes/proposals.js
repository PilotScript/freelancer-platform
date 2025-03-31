const express = require('express');
const {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  changeProposalStatus,
  deleteProposal
} = require('../controllers/proposals');

const router = express.Router({ mergeParams: true });

// Import middleware
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getProposals)
  .post(protect, authorize('freelancer'), createProposal);

router
  .route('/:id')
  .get(protect, getProposal)
  .put(protect, authorize('freelancer'), updateProposal)
  .delete(protect, authorize('freelancer'), deleteProposal);

router
  .route('/:id/status')
  .put(protect, authorize('client', 'admin'), changeProposalStatus);

module.exports = router;
