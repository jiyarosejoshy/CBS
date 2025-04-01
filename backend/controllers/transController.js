const asyncHandler = require('express-async-handler');
const { 
    createTransaction, 
    getAllTransactions, 
    getTransactionById, 
    updateTransaction, 
    deleteTransaction,getAllTransactionsByAdmin
} = require('../models/transactionModel');

// ✅ Create a new transaction
const addTransaction = asyncHandler(async (req, res) => {
    const { amount, type, description } = req.body;
    const transaction = await createTransaction(amount, type, description);
    res.status(201).json(transaction.rows[0]);
});

// ✅ Get all transactions
const getTransactions = asyncHandler(async (req, res) => {
    const transactions = await getAllTransactions();
    res.json(transactions.rows);
});

// ✅ Get a single transaction by ID
const getTransaction = asyncHandler(async (req, res) => {
    const transaction = await getTransactionById(req.params.id);
    if (transaction.rows.length === 0) {
        res.status(404);
        throw new Error('Transaction not found');
    }
    res.json(transaction.rows[0]);
});

// ✅ Update a transaction
const modifyTransaction = asyncHandler(async (req, res) => {
    const { amount, type, description } = req.body;
    const transaction = await updateTransaction(req.params.id, amount, type, description);
    if (transaction.rows.length === 0) {
        res.status(404);
        throw new Error('Transaction not found');
    }
    res.json(transaction.rows[0]);
});

// ✅ Delete a transaction
const removeTransaction = asyncHandler(async (req, res) => {
    const transaction = await deleteTransaction(req.params.id);
    if (transaction.rows.length === 0) {
        res.status(404);
        throw new Error('Transaction not found');
    }
    res.json({ message: 'Transaction removed' });
});
const getAllUserTransactions = asyncHandler(async (req, res) => {
    const transactions = await getAllTransactionsByAdmin();
    res.json(transactions.rows);
});

module.exports = { getAllUserTransactions,addTransaction, getTransactions, getTransaction, modifyTransaction, removeTransaction };
