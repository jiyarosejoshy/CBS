const supabase = require('../config/supabase');

// Get all account holders with balance
const getAllAccountHolders = async () => {
  const { data, error } = await supabase.from('accounts').select('*');
  if (error) throw error;
  return data;
};

// Get customers with balance > 10000
const getHighBalanceCustomers = async () => {
  const { data, error } = await supabase.from('accounts').select('*').gt('balance', 10000);
  if (error) throw error;
  return data;
};

// Delete an account
const deleteAccount = async (id) => {
  const { error } = await supabase.from('accounts').delete().eq('id', id);
  if (error) throw error;
};

// Fund transfer between accounts
const transferFunds = async (fromAccountId, toAccountId, amount) => {
  const { data: sender, error: senderError } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', fromAccountId)
    .single();

  if (senderError) throw senderError;
  if (!sender || sender.balance < amount) throw new Error('Insufficient balance');

  const { error: debitError } = await supabase
    .from('accounts')
    .update({ balance: sender.balance - amount })
    .eq('id', fromAccountId);

  if (debitError) throw debitError;

  const { data: receiver, error: receiverError } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', toAccountId)
    .single();

  if (receiverError) throw receiverError;

  const { error: creditError } = await supabase
    .from('accounts')
    .update({ balance: receiver.balance + amount })
    .eq('id', toAccountId);

  if (creditError) throw creditError;

  return { message: 'Transfer successful' };
};

module.exports = { getAllAccountHolders, getHighBalanceCustomers, deleteAccount, transferFunds };
