const Payment = require('../models/Payment');
const Job = require('../models/Job');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = asyncHandler(async (req, res, next) => {
  let query;

  // Different queries based on user role
  if (req.user.role === 'freelancer') {
    query = Payment.find({ freelancer: req.user.id });
  } else if (req.user.role === 'client') {
    query = Payment.find({ client: req.user.id });
  } else if (req.user.role === 'admin') {
    query = Payment.find();
  }

  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Payment.countDocuments(query);

  query = query.skip(startIndex).limit(limit);

  // Add sorting
  query = query.sort('-createdAt');

  // Add population
  query = query.populate({
    path: 'job',
    select: 'title'
  }).populate({
    path: 'client',
    select: 'firstName lastName'
  }).populate({
    path: 'freelancer',
    select: 'firstName lastName'
  });

  // Execute query
  const payments = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: payments.length,
    pagination,
    data: payments
  });
});

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate({
      path: 'job',
      select: 'title description'
    })
    .populate({
      path: 'client',
      select: 'firstName lastName email'
    })
    .populate({
      path: 'freelancer',
      select: 'firstName lastName email'
    });

  if (!payment) {
    return next(
      new ErrorResponse(`No payment found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is authorized to view the payment
  if (
    payment.client._id.toString() !== req.user.id &&
    payment.freelancer._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this payment`,
        403
      )
    );
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Create payment intent (Stripe)
// @route   POST /api/payments/create-payment-intent
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

  // Create payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    metadata: {
      jobId,
      clientId: req.user.id,
      freelancerId: job.freelancer ? job.freelancer.toString() : null
    }
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Process payment (after Stripe confirmation)
// @route   POST /api/payments/process
// @access  Private (Client only)
exports.processPayment = asyncHandler(async (req, res, next) => {
  const { paymentIntentId, jobId } = req.body;

  // Validate input
  if (!paymentIntentId || !jobId) {
    return next(
      new ErrorResponse('Please provide payment intent ID and job ID', 400)
    );
  }

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
    transactionId: paymentIntentId,
    description: `Payment for job: ${job.title}`
  });

  // Update job status if needed
  if (job.status === 'in-progress') {
    job.status = 'completed';
    await job.save();
  }

  res.status(201).json({
    success: true,
    data: payment
  });
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

  // Release payment
  payment.escrow = false;
  payment.releaseDate = Date.now();
  await payment.save();

  res.status(200).json({
    success: true,
    data: payment
  });
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

  // Process refund with Stripe
  try {
    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId,
      reason: 'requested_by_customer'
    });

    // Update payment status
    payment.status = 'refunded';
    await payment.save();

    res.status(200).json({
      success: true,
      data: {
        payment,
        refundId: refund.id
      }
    });
  } catch (err) {
    return next(
      new ErrorResponse('Error processing refund: ' + err.message, 500)
    );
  }
});
