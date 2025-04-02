const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { getUserById } = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await getUserById(decoded.id);
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, invalid token");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

// ✅ Admin Middleware (Restrict access to Admins only)
const adminOnly = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized, admin access only");
    }
});

module.exports = { protect, adminOnly };
