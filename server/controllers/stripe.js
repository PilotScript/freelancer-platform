const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Job = require('../models/Job');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private (Client only)
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { jobId, amount } = req.body;

  // Validate input
  if (!jobId || !amount) {
    return next(
      new ErrorResponse('Please provide job ID and amount', 400)
    );
  }

  // Check if job exists and client owns it
  const job = await Job.findById(jobId);
  
  if (!job) {
    return next(
      new ErrorResponse(`No job found with id of ${jobId}`, 404)
    );
  }

  if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to make payment for this job`,
        403
      )
    );
  }

  // Calculate application fee (10% of the amount)
  const applicationFee = Math.round(amount * 0.1 * 100) / 100;
  const totalAmount = amount + applicationFee;

  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        jobId,
        clientId: req.user.id,
        freelancerId: job.freelancer ? job.freelancer.toString() : null,
        applicationFee: applicationFee
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      applicationFee
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return next(
      new ErrorResponse('Error creating payment intent: ' + err.message, 500)
    );
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private (Client only)
exports.confirmPayment = asyncHandler(async (req, res, next) => {
  const { paymentIntentId, jobId } = req.body;

  // Validate input
  if (!paymentIntentId || !jobId) {
    return next(
      new ErrorResponse('Please provide payment intent ID and job ID', 400)
    );
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return next(
        new ErrorResponse('Payment has not been completed', 400)
      );
    }

    // Get job details
    const job = await Job.findById(jobId);
    
    if (!job) {
      return next(
        new ErrorResponse(`No job found with id of ${jobId}`, 404)
      );
    }

    if (!job.freelancer) {
      return next(
        new ErrorResponse('No freelancer assigned to this job', 400)
      );
    }

    // Create payment record
    const payment = await Payment.create({
      job: jobId,
      client: req.user.id,
      freelancer: job.freelancer,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      paymentMethod: 'stripe',
      status: 'completed',
      escrow: true, // Hold in escrow until work is completed
      transactionId: paymentIntentId,
      description: `Payment for job: ${job.title}`
    });

    // Update job status if needed
    if (job.status === 'open') {
      job.status = 'in-progress';
      await job.save();
    }

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return next(
      new ErrorResponse('Error confirming payment: ' + err.message, 500)
    );
  }
});

// @desc    Release payment from escrow
// @route   PUT /api/payments/:id/release
// @access  Private (Client only)
exports.releasePayment = asyncHandler(async (req, res, next) => {
  let payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(
      new ErrorResponse(`No payment found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is the client
  if (payment.client.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to release this payment`,
        403
      )
    );
  }

  // Check if payment is in escrow
  if (!payment.escrow) {
    return next(
      new ErrorResponse('This payment is not in escrow', 400)
    );
  }

  try {
    // Release payment
    payment.escrow = false;
    payment.releaseDate = Date.now();
    await payment.save();

    // Update job status
    const job = await Job.findById(payment.job);
    if (job && job.status === 'in-progress') {
      job.status = 'completed';
      await job.save();
    }

    // Create a transfer to the freelancer (in a real app, you would have connected accounts)
    // This is a simplified example
    /*
    const transfer = await stripe.transfers.create({
      amount: Math.round((payment.amount * 0.9) * 100), // 90% of the payment (after platform fee)
      currency: payment.currency,
      destination: 'freelancer_stripe_account_id', // You would store this in the User model
      transfer_group: payment.transactionId
    });
    */

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return next(
      new ErrorResponse('Error releasing payment: ' + err.message, 500)
    );
  }
});

// @desc    Request refund
// @route   POST /api/payments/:id/refund
// @access  Private (Client only)
exports.requestRefund = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  
  if (!reason) {
    return next(
      new ErrorResponse('Please provide a reason for the refund', 400)
    );
  }

  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(
      new ErrorResponse(`No payment found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is the client
  if (payment.client.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to request a refund for this payment`,
        403
      )
    );
  }

  // Check if payment can be refunded
  if (payment.status !== 'completed' || !payment.escrow) {
    return next(
      new ErrorResponse('This payment cannot be refunded', 400)
    );
  }

  try {
    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId,
      reason: 'requested_by_customer'
    });

    // Update payment status
    payment.status = 'refunded';
    await payment.save();

    // Update job status
    const job = await Job.findById(payment.job);
    if (job && job.status === 'in-progress') {
      job.status = 'cancelled';
      await job.save();
    }

    res.status(200).json({
      success: true,
      data: {
        payment,
        refundId: refund.id
      }
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return next(
      new ErrorResponse('Error processing refund: ' + err.message, 500)
    );
  }
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
exports.getPaymentMethods = asyncHandler(async (req, res, next) => {
  try {
    // In a real app, you would retrieve the customer's saved payment methods
    // This is a simplified example
    const paymentMethods = [
      {
        id: 'pm_1234567890',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        }
      }
    ];

    res.status(200).json({
      success: true,
      data: paymentMethods
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return next(
      new ErrorResponse('Error retrieving payment methods: ' + err.message, 500)
    );
  }
});

// @desc    Create payment webhook handler
// @route   POST /api/payments/webhook
// @access  Public
exports.handleWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful:', paymentIntent.id);
      // You would update your database here
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log('Payment failed:', failedPaymentIntent.id);
      // You would update your database here
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});
