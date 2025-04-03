const express = require("express");
const { fetchTransactionsByBranch, fetchLoansByBranch } = require("../controllers/superadminController");

const router = express.Router();

// Route to get transactions by branch
router.get("/transactions/:branch", fetchTransactionsByBranch);

// Route to get loans by branch
router.get("/loans/:branch", fetchLoansByBranch);

module.exports = router;
