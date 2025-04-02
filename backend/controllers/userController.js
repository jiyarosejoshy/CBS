const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAllUsers, getUserDetails,getUserAccounts, createUser, updateUser, deleteUser } = require('../models/userModel');


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

// // ✅ Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserById(email);
    console.log(user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
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
module.exports = { getUserAccountDetails,registerUser, loginUser, getUsers, updateUserProfile, removeUser };
