// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getAllTransactions,
    addTransaction, 
     
    getTransaction, 
    modifyTransaction, 
    removeTransaction 
} = require('../controllers/transController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.post('/', addTransaction);

// Protected
router.get('/', getAllTransactions);
router.get('/:id', protect, getTransaction);
router.put('/:id', protect, modifyTransaction);
router.delete('/:id', protect, removeTransaction);

module.exports = router;