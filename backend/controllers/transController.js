const supabase = require('../config/supabase');
const asyncHandler = require('express-async-handler');
const { 
    createTransaction, 
    getAllTransactionss, 
    getTransactionById, 
    updateTransaction, 
    deleteTransaction
} = require('../models/transModel');

// ✅ Create a new transaction
const addTransaction = asyncHandler(async (req, res) => {
    const { account_no, first_name, last_name, type, balance } = req.body;
    const transaction = await createTransaction(account_no, first_name, last_name, type, balance);
    res.status(201).json(transaction);  // ✅ Removed .rows[0]
});

// ✅ Get all transactions
const getAllTransactions = asyncHandler(async (req, res) => {
    const transactions = await getAllTransactionss();
    res.json(transactions);  // ✅ Removed .rows
});

// ✅ Get a single transaction by ID
const getTransaction = asyncHandler(async (req, res) => {
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) {  // ✅ Fixed .rows.length issue
        res.status(404);
        throw new Error('Transaction not found');
    }
    res.json(transaction);
});

// ✅ Update a transaction
const modifyTransaction = asyncHandler(async (req, res) => {
    const updatedFields = req.body;
    const transaction = await updateTransaction(req.params.id, updatedFields);
    if (!transaction) {  // ✅ Fixed .rows.length issue
        res.status(404);
        throw new Error('Transaction not found');
    }
    res.json(transaction);
});

// ✅ Delete a transaction
const removeTransaction = asyncHandler(async (req, res) => {
    await deleteTransaction(req.params.id);
    res.json({ message: 'Transaction removed' });
});
const getAllTransactionsByAdmin = async (req, res) => {
    try {
      console.log("Fetching transactions...");
      let query = supabase.from('transactions').select('*');
  
      if (req.query.type) {
        query = query.eq('transaction_type', req.query.type);
      }
      if (req.query.status) {
        query = query.eq('status', req.query.status);
      }
  
      console.log("Query:", query);
  
      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
  
      console.log("Fetched Data:", data);
      res.json(data);
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  

module.exports = { addTransaction, getAllTransactions, getTransaction, modifyTransaction, removeTransaction,getAllTransactionsByAdmin };
