const express = require("express");
const { fetchTransactionsByBranch, fetchLoansByBranch, getBranchNames } = require("../controllers/superadminController");

const router = express.Router();

// Route to get transactions by branch
router.get("/transactions/:branch", fetchTransactionsByBranch);

// Route to get loans by branch
router.get("/loans/:branch", fetchLoansByBranch);

router.get("/loan/branches", (req, res, next) => {
    console.log("🚀 [Route] GET /api/branch/loans/branches called");
    next();
  }, getBranchNames);
  


module.exports = router;
 