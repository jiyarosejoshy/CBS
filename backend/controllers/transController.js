const supabase = require('../config/supabase');
const asyncHandler = require('express-async-handler');
const { 
    createTransaction, 
    getAllTransactionss, 
    getTransactionById, 
    updateTransaction, 
    deleteTransaction
} = require('../models/transModel');



const addTransaction = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body);  

        // const { account_no, first_name, last_name, type, balance } = req.body;
        const { account_no, first_name, last_name, type,amount} = req.body;

        if (!account_no || !first_name || !last_name || !type ||!amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Insert into Supabase transactions table
        const { data, error } = await supabase
            .from("transactions")  // Your Supabase table name
            .insert([
                {
                    amount, 
                    account_no,
                    first_name,
                    last_name,
                    type,//credit/debit
                    transac_time: new Date().toISOString(), // Automatically add timestamp
                }
            ]);

        if (error) {
            console.error("Supabase Insert Error:", error);
            return res.status(500).json({ message: "Database insert failed", error: error.message });
        }

        return res.status(201).json({
            message: "Transaction added successfully",
            // transaction: data

        });

    } catch (error) {
        console.error("Error in addTransaction:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};






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
