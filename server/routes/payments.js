const express = require('express');
const {
  createPaymentIntent,
  confirmPayment,
  releasePayment,
  requestRefund,
  getPaymentMethods,
  handleWebhook
} = require('../controllers/stripe');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Routes that require authentication
router.post('/create-intent', protect, authorize('client', 'admin'), createPaymentIntent);
router.post('/confirm', protect, authorize('client', 'admin'), confirmPayment);
router.put('/:id/release', protect, authorize('client', 'admin'), releasePayment);
router.post('/:id/refund', protect, authorize('client', 'admin'), requestRefund);
router.get('/methods', protect, getPaymentMethods);

// Webhook doesn't require authentication (called by Stripe)
router.post('/webhook', handleWebhook);

module.exports = router;
