const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all proposals
// @route   GET /api/proposals
// @route   GET /api/jobs/:jobId/proposals
// @access  Private
exports.getProposals = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.jobId) {
    // Get proposals for a specific job
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return next(
        new ErrorResponse(`No job found with id of ${req.params.jobId}`, 404)
      );
    }

    // Check if user is authorized to view proposals
    if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view proposals for this job`,
          403
        )
      );
    }

    query = Proposal.find({ job: req.params.jobId }).populate({
      path: 'freelancer',
      select: 'firstName lastName profileImage title hourlyRate'
    });
  } else {
    // Get all proposals based on user role
    if (req.user.role === 'freelancer') {
      // Freelancers can only see their own proposals
      query = Proposal.find({ freelancer: req.user.id }).populate({
        path: 'job',
        select: 'title budget status client',
        populate: {
          path: 'client',
          select: 'firstName lastName profileImage'
        }
      });
    } else if (req.user.role === 'client') {
      // Clients can only see proposals for their jobs
      const jobs = await Job.find({ client: req.user.id });
      const jobIds = jobs.map(job => job._id);
      
      query = Proposal.find({ job: { $in: jobIds } }).populate({
        path: 'job',
        select: 'title budget status'
      }).populate({
        path: 'freelancer',
        select: 'firstName lastName profileImage title hourlyRate'
      });
    } else if (req.user.role === 'admin') {
      // Admins can see all proposals
      query = Proposal.find().populate({
        path: 'job',
        select: 'title budget status client',
        populate: {
          path: 'client',
          select: 'firstName lastName profileImage'
        }
      }).populate({
        path: 'freelancer',
        select: 'firstName lastName profileImage title hourlyRate'
      });
    }
  }

  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Proposal.countDocuments(query);

  query = query.skip(startIndex).limit(limit);

  // Sort by date
  query = query.sort('-createdAt');

  // Execute query
  const proposals = await query;

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
    count: proposals.length,
    pagination,
    data: proposals
  });
});

// @desc    Get single proposal
// @route   GET /api/proposals/:id
// @access  Private
exports.getProposal = asyncHandler(async (req, res, next) => {
  const proposal = await Proposal.findById(req.params.id)
    .populate({
      path: 'job',
      select: 'title description budget status client',
      populate: {
        path: 'client',
        select: 'firstName lastName profileImage'
      }
    })
    .populate({
      path: 'freelancer',
      select: 'firstName lastName profileImage title hourlyRate skills'
    });

  if (!proposal) {
    return next(
      new ErrorResponse(`No proposal found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is authorized to view the proposal
  const job = await Job.findById(proposal.job);
  
  if (
    proposal.freelancer._id.toString() !== req.user.id &&
    job.client.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this proposal`,
        403
      )
    );
  }

  res.status(200).json({
    success: true,
    data: proposal
  });
});

// @desc    Create proposal
// @route   POST /api/jobs/:jobId/proposals
// @access  Private (Freelancer only)
exports.createProposal = asyncHandler(async (req, res, next) => {
  // Check if job exists
  const job = await Job.findById(req.params.jobId);
  
  if (!job) {
    return next(
      new ErrorResponse(`No job found with id of ${req.params.jobId}`, 404)
    );
  }

  // Check if user is a freelancer
  if (req.user.role !== 'freelancer') {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to create a proposal`,
        403
      )
    );
  }

  // Check if job is open
  if (job.status !== 'open') {
    return next(
      new ErrorResponse(`Job is not open for proposals`, 400)
    );
  }

  // Check if freelancer already submitted a proposal for this job
  const existingProposal = await Proposal.findOne({
    job: req.params.jobId,
    freelancer: req.user.id
  });

  if (existingProposal) {
    return next(
      new ErrorResponse(
        `You have already submitted a proposal for this job`,
        400
      )
    );
  }

  // Add job and freelancer to req.body
  req.body.job = req.params.jobId;
  req.body.freelancer = req.user.id;

  const proposal = await Proposal.create(req.body);

  // Add proposal to job's proposals array
  job.proposals.push(proposal._id);
  await job.save();

  res.status(201).json({
    success: true,
    data: proposal
  });
});

// @desc    Update proposal
// @route   PUT /api/proposals/:id
// @access  Private (Freelancer only - own proposals)
exports.updateProposal = asyncHandler(async (req, res, next) => {
  let proposal = await Proposal.findById(req.params.id);

  if (!proposal) {
    return next(
      new ErrorResponse(`No proposal found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is proposal owner
  if (proposal.freelancer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this proposal`,
        403
      )
    );
  }

  // Check if proposal status is pending
  if (proposal.status !== 'pending') {
    return next(
      new ErrorResponse(
        `Cannot update proposal with status ${proposal.status}`,
        400
      )
    );
  }

  proposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: proposal
  });
});

// @desc    Change proposal status (accept/reject)
// @route   PUT /api/proposals/:id/status
// @access  Private (Client only - job owner)
exports.changeProposalStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !['accepted', 'rejected'].includes(status)) {
    return next(
      new ErrorResponse('Please provide a valid status (accepted or rejected)', 400)
    );
  }

  let proposal = await Proposal.findById(req.params.id);

  if (!proposal) {
    return next(
      new ErrorResponse(`No proposal found with id of ${req.params.id}`, 404)
    );
  }

  // Get the job to check ownership
  const job = await Job.findById(proposal.job);

  // Make sure user is job owner
  if (job.client.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this proposal status`,
        403
      )
    );
  }

  // Update proposal status
  proposal.status = status;
  await proposal.save();

  // If proposal is accepted, update job status and assign freelancer
  if (status === 'accepted') {
    job.status = 'in-progress';
    job.freelancer = proposal.freelancer;
    await job.save();

    // Reject all other proposals for this job
    await Proposal.updateMany(
      { 
        job: job._id, 
        _id: { $ne: proposal._id },
        status: 'pending'
      },
      { status: 'rejected' }
    );
  }

  res.status(200).json({
    success: true,
    data: proposal
  });
});

// @desc    Delete proposal
// @route   DELETE /api/proposals/:id
// @access  Private (Freelancer only - own proposals)
exports.deleteProposal = asyncHandler(async (req, res, next) => {
  const proposal = await Proposal.findById(req.params.id);

  if (!proposal) {
    return next(
      new ErrorResponse(`No proposal found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is proposal owner
  if (proposal.freelancer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this proposal`,
        403
      )
    );
  }

  // Check if proposal status is pending
  if (proposal.status !== 'pending') {
    return next(
      new ErrorResponse(
        `Cannot delete proposal with status ${proposal.status}`,
        400
      )
    );
  }

  await proposal.remove();

  // Remove proposal from job's proposals array
  const job = await Job.findById(proposal.job);
  if (job) {
    job.proposals = job.proposals.filter(
      p => p.toString() !== proposal._id.toString()
    );
    await job.save();
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
