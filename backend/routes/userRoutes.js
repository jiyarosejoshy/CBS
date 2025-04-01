const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Register a new user
router.post('/register', registerUser);

// ✅ Login user & get token
router.post('/login', loginUser);

// ✅ Get user profile (Protected route)
router.get('/profile', protect, getUserProfile);

// ✅ Update user profile (Protected route)
router.put('/profile', protect, updateUserProfile);

module.exports = router;
