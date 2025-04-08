const { getTransactionsByBranch, getBranchs,getLoansByBranch } = require("../models/superadminModel");

// Controller function to get transactions by branch
const fetchTransactionsByBranch = async (req, res) => {
    const { branch } = req.params;
    try {
        const transactions = await getTransactionsByBranch(branch);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching transactions" });
    }
};
// superadminController.js
const getBranchNames = async (req, res) => {
    console.log("📥 [Controller] getBranchNames() triggered");
  
    try { 
      const branches = await getBranchs();
      console.log("📤 [Controller] Branches returned from model:", branches);
      res.json(branches);
    } catch (err) {
      console.error("❌ [Controller] Error fetching branches:", err);
      res.status(500).json({ error: "Server error fetching branches" });
    }
  };

// Controller function to get loans by branch
const fetchLoansByBranch = async (req, res) => {
    const { branch } = req.params;
    try {
        const loans = await getLoansByBranch(branch);
        console.log("🔍 Loans from Supabase:", loans); // Add this
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: "Error fetching loans" });
    }
};


module.exports = { getBranchNames,fetchTransactionsByBranch, fetchLoansByBranch };
