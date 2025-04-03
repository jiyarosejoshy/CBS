const { getTransactionsByBranch, getLoansByBranch } = require("../models/superadminModel");

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

// Controller function to get loans by branch
const fetchLoansByBranch = async (req, res) => {
    const { branch } = req.params;
    try {
        const loans = await getLoansByBranch(branch);
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: "Error fetching loans" });
    }
};

module.exports = { fetchTransactionsByBranch, fetchLoansByBranch };
