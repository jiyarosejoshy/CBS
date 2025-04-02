const express = require('express');
const router = express.Router();
const { getUsers, updateUserProfile, removeUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser } = require("../controllers/authController");
const { getUserAccountDetails,fetchLoans } = require('../controllers/userController');

// Public Routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// // Protected Routes
// router.get('/', protect, getUsers);
// router.put('/profile', protect, updateUserProfile);
// router.delete('/:id', protect, removeUser);
router.get('/account', getUserAccountDetails);
router.get('/loans/user/:uuid', fetchLoans);
router.get('/user/:uuid', getUserAccountDetails);
module.exports = router;
