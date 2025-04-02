// controllers/adminController.js
const supabase = require('../config/supabase');
const { getAllAccountHolders, deleteAccount } = require('../models/adminModel');

// Your existing controller functions with proper supabase imports

// Display all account holders
const getAccounts = async (req, res) => {
  try {
    const accounts = await getAllAccountHolders();
    res.json(accounts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete an account
const removeAccount = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAccount(id);
    res.status(200).send('Account deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};





const getAllLoans = async (req, res) => {
  try {
    let query = supabase.from('loans').select('*');
    
    // Apply filters if provided
    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }
    if (req.query.type) {
      query = query.eq('loan_type', req.query.type);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('loan_id', req.params.loanId)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Loan not found' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPendingLoans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('status', 'pending');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveLoan = async (req, res) => {
  try {
    const { data: loan, error: fetchError } = await supabase
      .from('loans')
      .select('*')
      .eq('loan_id', req.params.loanId)
      .single();
    
    if (fetchError) throw fetchError;
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status !== 'pending') {
      return res.status(400).json({ error: 'Loan is not in pending status' });
    }
    
    const { data, error } = await supabase
      .from('loans')
      .update({ 
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('loan_id', req.params.loanId)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectLoan = async (req, res) => {
  try {
    const { data: loan, error: fetchError } = await supabase
      .from('loans')
      .select('*')
      .eq('loan_id', req.params.loanId)
      .single();
    
    if (fetchError) throw fetchError;
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status !== 'pending') {
      return res.status(400).json({ error: 'Loan is not in pending status' });
    }
    
    const { data, error } = await supabase
      .from('loans')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('loan_id', req.params.loanId)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAccounts,
  removeAccount,
  getAllLoans,
  getLoanById,
  getPendingLoans,
  approveLoan,
  rejectLoan
};

