const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserPortfolio,
  uploadProfileImage
} = require('../controllers/users');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(protect, authorize('admin'), getUsers);

router
  .route('/:id')
  .get(getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router
  .route('/:id/portfolio')
  .get(getUserPortfolio);

router
  .route('/:id/upload-profile-image')
  .put(protect, upload.single('profileImage'), uploadProfileImage);

module.exports = router;
