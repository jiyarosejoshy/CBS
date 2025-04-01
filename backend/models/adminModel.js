const supabase = require('../config/supabase');

// Get all account holders with balance
const getAllAccountHolders = async () => {
  const { data, error } = await supabase.from('user').select('*');
  if (error) throw error;
  return data;
};



// Delete an account
const deleteAccount = async (id) => {
  const { error } = await supabase.from('user').delete().eq('id', id);
  if (error) throw error;
};

// Fund transfer between user
const transferFunds = async (fromAccountId, toAccountId, amount) => {
  const { data: sender, error: senderError } = await supabase
    .from('user')
    .select('balance')
    .eq('id', fromAccountId)
    .single();

  if (senderError) throw senderError;
  if (!sender || sender.balance < amount) throw new Error('Insufficient balance');

  const { error: debitError } = await supabase
    .from('user')
    .update({ balance: sender.balance - amount })
    .eq('id', fromAccountId);

  if (debitError) throw debitError;

  const { data: receiver, error: receiverError } = await supabase
    .from('user')
    .select('balance')
    .eq('id', toAccountId)
    .single();

  if (receiverError) throw receiverError;

  const { error: creditError } = await supabase
    .from('user')
    .update({ balance: receiver.balance + amount })
    .eq('id', toAccountId);

  if (creditError) throw creditError;

  return { message: 'Transfer successful' };
};

module.exports = { getAllAccountHolders, deleteAccount, transferFunds };