const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => res.json(req.user)); // Protected user profile

module.exports = router;
