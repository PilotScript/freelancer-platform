const express = require('express');
const {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
  markAsRead
} = require('../controllers/messages');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/unread', protect, getUnreadCount);

router
  .route('/:userId')
  .get(protect, getMessages)
  .post(protect, sendMessage);

router.put('/:id/read', protect, markAsRead);

module.exports = router;
