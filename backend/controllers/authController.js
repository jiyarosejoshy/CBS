const { getUserByEmail } = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const bcrypt = require("bcryptjs"); // 🔹 Added bcrypt import
const jwt = require("jsonwebtoken"); // 🔹 Added jwt import
const { createUser } = require("../models/userModel");


// ✅ Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, passwordHash);

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id, user.role),  // Include role in token
    });
});

// ✅ Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401);
        throw new Error("Invalid credentials");
    }
    console.log(user);

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // Send role for frontend redirection
        token: generateToken(user.id, user.role),
    });
});

// 🔑 Generate JWT Token (Include Role)
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
module.exports = { registerUser, loginUser };