const supabase = require('../config/supabase');
const { getUserAccountDetails } = require('../controllers/userController');
const getUserDetails = async (uuid) => {
  console.log(`Fetching user details for UUID: ${uuid}`);
  
  const { data: user, error: userError } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', uuid)
      .single();

  if (userError) {
      console.error("User fetch error:", userError);
      throw new Error(userError.message);
  }

  console.log("User query result:", user);
  return user;
};

// Fetch account details for a given user UUID
const getUserAccounts = async (uuid) => {
  console.log(`Fetching accounts for user UUID: ${uuid}`);

  const { data: accounts, error: accountError } = await supabase
      .from('accounts')
      .select('account_no, balance')
      .eq('user_id', uuid);

  if (accountError) {
      console.error("Accounts fetch error:", accountError);
      throw new Error(accountError.message);
  }

  console.log("User accounts:", accounts);
  return accounts;
};
// ✅ Get all users
const getAllUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

// ✅ Get user by ID
const getUserByEmail = async (email) => {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
  if (error) return null;
  return data;
};

// ✅ Create a new user
const createUser = async (name, email, passwordHash) => {
  const { data, error } = await supabase.from('users').insert([{ name, email, password: passwordHash }]).select().single();
  if (error) throw error;
  return data;
};

// ✅ Update user information
const updateUser = async (id, updatedFields) => {
  const { data, error } = await supabase.from('users').update(updatedFields).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// ✅ Delete a user
const deleteUser = async (id) => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return { message: 'User deleted successfully' };
};

module.exports = {getUserDetails,getUserAccounts, getAllUsers, getUserByEmail, createUser, updateUser, deleteUser };
