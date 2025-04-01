// Load environment variables
require('dotenv').config(); // Adjust the path if needed

const { createClient } = require('@supabase/supabase-js');

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);


if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase URL or Anon Key. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) throw error;

    console.log('✅ Supabase connection successful!');
    console.log('Sample data:', data);
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
  }
})();

module.exports = supabase;
