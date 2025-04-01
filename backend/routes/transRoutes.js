// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { 
    addTransaction, 
    getTransactions, 
    getTransaction, 
    modifyTransaction, 
    removeTransaction 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.post('/', addTransaction);

// Protected
router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransaction);
router.put('/:id', protect, modifyTransaction);
router.delete('/:id', protect, removeTransaction);

module.exports = router;