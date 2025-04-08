const supabase = require('../config/supabase');

// Get all account holders with balance
const getAllAccountHolders = async () => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) throw error;
  return data;
};

// Delete an account
const deleteAccount = async (id) => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
};

module.exports = { 
  getAllAccountHolders, 
  deleteAccount 
};