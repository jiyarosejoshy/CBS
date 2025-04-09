const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getLoanIdsAndStatus,addLoanToDB,getLoans,getAllUsers, getUserDetails,getUserAccounts, createUser, updateUser, deleteUser,getUserByEmail } = require('../models/userModel');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const supabase = require('../config/supabase');

// ✅ Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await getUserById(email);
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, passwordHash);

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
    });
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await getUserByEmail(email);
  
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
  
    // Compare plain passwords directly
    if (password !== user.Password) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  
    // Return basic session-like data
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      sessionId: user.id, // Can be treated like a session key
    });
  });
  
  
// ✅ Get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
});

// ✅ Update user
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await updateUser(req.user.id, req.body);
    res.json(user);
});

// ✅ Delete user
const removeUser = asyncHandler(async (req, res) => {
    await deleteUser(req.params.id);
    res.json({ message: 'User removed' });
});

// 🔑 Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const getUserAccountDetails = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Fetch user details
        const user = await getUserDetails(uuid);

        // Fetch account details separately
        const accounts = await getUserAccounts(uuid);

        // Combine the results
        const response = { ...user, accounts };

        res.json(response);
    } catch (error) {
        console.error("Error fetching user with accounts:", error.message);
        res.status(500).json({ error: error.message });
    }
};
const fetchLoans = async (req, res) => {
    const { uuid } = req.params;
  try {
    const loans = await getLoans(uuid);
    if (loans.length === 0) {
      return res.status(404).json({ message: 'No loans found for this user' });
    }
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user loans', error: err.message });
  }s.status(500).json({ message: 'Error fetching loans', error: err.message });
    
  };


  
const addLoan = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body);

        const { user_id, loan_amount, loan_type, interest_rate, start_date, end_date, status, collateral_type, collateral_value } = req.body;

        if (!user_id || !loan_amount || !loan_type || !interest_rate || !start_date || !end_date || !status || !collateral_type || !collateral_value) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Insert into Supabase loans table
        const { data, error } = await supabase
            .from("loans")
            .insert([
                {
                    loan_id: uuidv4(), // Generate a UUID
                    user_id,
                    loan_amount,
                    loan_type,
                    interest_rate,
                    start_date,
                    end_date,
                    status,
                    collateral_type,
                    collateral_value,
                    created_at: new Date().toISOString(), // Automatically add timestamp
                    updated_at: new Date().toISOString(),
                }
            ]);

        if (error) {
            console.error("Supabase Insert Error:", error);
            return res.status(500).json({ message: "Database insert failed", error: error.message });
        }

        return res.status(201).json({
            message: "Loan added successfully",
            loan: data
        });

    } catch (error) {
        console.error("Error in addLoan:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};
const fetchLoanIdsAndStatus = async (req, res) => {
    try {
      const loans = await getLoanIdsAndStatus();
      res.json(loans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = { fetchLoanIdsAndStatus, getLoanIdsAndStatus,addLoan,fetchLoans,getUserAccountDetails,registerUser, loginUser, getUsers, updateUserProfile, removeUser };
