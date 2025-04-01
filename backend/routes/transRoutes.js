const express = require('express');
const { getAllUserTransactions } = require('../controllers/adminController');
const router = express.Router();
const { 
    addTransaction, 
    getTransactions, 
    getTransaction, 
    modifyTransaction, 
    removeTransaction 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/', addTransaction);

// Protected Routes
router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransaction);
router.put('/:id', protect, modifyTransaction);
router.delete('/:id', protect, removeTransaction);
router.get('/transactions', getAllUserTransactions);
module.exports = router;