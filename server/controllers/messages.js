const Message = require('../models/Message');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = asyncHandler(async (req, res, next) => {
  // Find all messages where the current user is either sender or recipient
  const messages = await Message.find({
    $or: [
      { sender: req.user.id },
      { recipient: req.user.id }
    ]
  }).sort('-createdAt');

  // Extract unique conversation partners
  const conversations = [];
  const conversationPartners = new Set();

  for (const message of messages) {
    const partnerId = message.sender.toString() === req.user.id ? 
      message.recipient.toString() : message.sender.toString();
    
    if (!conversationPartners.has(partnerId)) {
      conversationPartners.add(partnerId);
      
      // Get partner details
      const partner = await User.findById(partnerId).select('firstName lastName profileImage');
      
      // Get unread count
      const unreadCount = await Message.countDocuments({
        sender: partnerId,
        recipient: req.user.id,
        read: false
      });
      
      conversations.push({
        partnerId,
        partnerName: `${partner.firstName} ${partner.lastName}`,
        partnerImage: partner.profileImage,
        lastMessage: message.content,
        lastMessageDate: message.createdAt,
        unreadCount
      });
    }
  }

  res.status(200).json({
    success: true,
    count: conversations.length,
    data: conversations
  });
});

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(
      new ErrorResponse(`No user found with id of ${userId}`, 404)
    );
  }
  
  // Get messages between current user and specified user
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, recipient: userId },
      { sender: userId, recipient: req.user.id }
    ]
  }).sort('createdAt');
  
  // Mark messages as read
  await Message.updateMany(
    { sender: userId, recipient: req.user.id, read: false },
    { read: true }
  );
  
  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Send message to user
// @route   POST /api/messages/:userId
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const recipientId = req.params.userId;
  
  // Check if recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return next(
      new ErrorResponse(`No user found with id of ${recipientId}`, 404)
    );
  }
  
  // Create message
  const message = await Message.create({
    content,
    sender: req.user.id,
    recipient: recipientId,
    job: req.body.job || null,
    attachments: req.body.attachments || []
  });
  
  res.status(201).json({
    success: true,
    data: message
  });
});

// @desc    Get unread message count
// @route   GET /api/messages/unread
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Message.countDocuments({
    recipient: req.user.id,
    read: false
  });
  
  res.status(200).json({
    success: true,
    data: { count }
  });
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  let message = await Message.findById(req.params.id);
  
  if (!message) {
    return next(
      new ErrorResponse(`No message found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check if user is the recipient
  if (message.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to mark this message as read`,
        403
      )
    );
  }
  
  message.read = true;
  await message.save();
  
  res.status(200).json({
    success: true,
    data: message
  });
});
