const express = require('express');
const dotenv = require('dotenv');
const supabase = require('./config/supabase');
const cors = require('cors');
// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transactionRoutes = require('./routes/transRoutes');
const tellerRoutes = require('./routes/tellerRoutes');

const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test database connection on startup
const verifyDatabaseConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    console.log('Database connection verified');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// API Routes
app.use('/chatbot',chatRoutes)
app.use('/api', userRoutes);
app.use('/admin', adminRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/teller', tellerRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await verifyDatabaseConnection();
});