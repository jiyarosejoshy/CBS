const express = require('express');
const dotenv = require('dotenv');
const supabase = require('./config/supabase'); // Ensure correct path
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// ✅ Test Supabase Connection
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful!');
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    process.exit(1);
  }
})();

// ✅ API Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
