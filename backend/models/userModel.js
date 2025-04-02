const supabase = require('../config/supabase');

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

module.exports = { getAllUsers, getUserByEmail, createUser, updateUser, deleteUser };
