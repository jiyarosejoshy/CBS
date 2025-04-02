const supabase = require('../config/supabase');

// ✅ Get all transactions
const getAllTransactionss = async () => {
  const { data, error } = await supabase.from('transactions').select('*');
  if (error) throw error;
  return data;  // ✅ Return only data
};

// ✅ Get transaction by ID
const getTransactionById = async (id) => {
  const { data, error } = await supabase.from('transactions').select('*').eq('trans_id', id).single();
  if (error) throw error;
  return data;
};

// ✅ Create a new transaction
const createTransaction = async (account_no, first_name, last_name, type, balance) => {
  const { data, error } = await supabase.from('transactions').insert([{ 
    account_no, 
    first_name, 
    last_name, 
    type, 
    balance, 
    transac_time: new Date().toISOString() 
  }]).select().single();
  if (error) throw error;
  return data;
};

// ✅ Update transaction
const updateTransaction = async (id, updatedFields) => {
  const { data, error } = await supabase.from('transactions').update(updatedFields).eq('trans_id', id).select().single();
  if (error) throw error;
  return data;
};

// ✅ Delete transaction
const deleteTransaction = async (id) => {
  const { error } = await supabase.from('transactions').delete().eq('trans_id', id);
  if (error) throw error;
  return { message: 'Transaction deleted successfully' };
};

module.exports = { getAllTransactionss, getTransactionById, createTransaction, updateTransaction, deleteTransaction };
