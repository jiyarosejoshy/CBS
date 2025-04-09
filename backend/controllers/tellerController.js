
const supabase = require('../config/supabase');
const TellerModel = require("../models/tellerModel");
const BalanceModel = require("../models/balanceModel");


// ✅ Log a new transaction in the teller table
const logTransaction = async (req, res) => {
    try {
        const { amount, trans_type, acc_no, first_name, last_name,branch} = req.body;
        console.log(branch);
        // Validate essential fields
        if (!amount || !trans_type || !acc_no || !branch) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const transaction = await TellerModel.createTellerTransaction(
            amount, trans_type, acc_no, first_name, last_name, branch
        );

        return res.status(201).json({ message: "Transaction logged successfully", transaction });
    } catch (error) {
        console.error("Error logging transaction:", error);
        console.error(error); 
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Update a transaction by trans_id
const updateTransaction = async (req, res) => {
    try {
        const { trans_id } = req.params;
        const { amount, trans_type } = req.body;

        if (!amount || !trans_type) {
            return res.status(400).json({ message: "Amount and transaction type are required" });
        }

        const updatedTransaction = await TellerModel.updateTellerTransaction(trans_id, { amount, trans_type });

        return res.status(200).json({ message: "Transaction updated successfully", updatedTransaction });
    } catch (error) {
        console.error("Error updating transaction:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Delete a transaction by trans_id
const deleteTransaction = async (req, res) => {
    try {
        const { trans_id } = req.params;

        await TellerModel.deleteTellerTransaction(trans_id);

        return res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Get all transactions by date
// const getTransactionsByDate = async (req, res) => {
//     try {
//         const { branch } = req.params;
//         const transactions = await TellerModel.getTransactionsByDate(branch);

//         return res.status(200).json({ transactions });
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };
const getTransactionsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const transactions = await TellerModel.getTransactionsByDate(date);

        return res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// ✅ Set opening balance for a given date
const setOpeningBalance = async (req, res) => {
    try {
        const { open } = req.body;
        const { branch } = req.params;

        if (!branch || open === undefined) {
            return res.status(400).json({ message: "Branch and opening balance are required" });
        }

        const data = await BalanceModel.setOpeningBalance(branch, open);
        return res.status(200).json({ message: "Opening balance set successfully", data });
    } catch (error) {
        console.error("Error setting opening balance:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
// ✅ Get opening balance for a given date
const getOpeningBalance = async (req, res) => {
    try {
        const { branch } = req.params;
        console.log("Fetching opening balance for date:", branch);
        const openBalance = await BalanceModel.getOpeningBalance(branch);

        return res.status(200).json({ openBalance });
    } catch (error) {
        console.error("Error fetching opening balance:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Calculate closing balance based on transactions for the day
const getClosingBalance = async (req, res) => {
    try {
        const { date,branch } = req.params;
        const closingBalance = await BalanceModel.calculateClosingBalance(date,branch);
        console.log(closingBalance);

        if (closingBalance === null) {
            return res.status(404).json({ message: "Opening balance not found for this date" });
        }

        return res.status(200).json({ closingBalance });
    } catch (error) {
        console.error("Error calculating closing balance:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllBalances = async (req, res) => {
    try {
        // Fetch all balance records from the "balances" table
        const { data, error } = await supabase
            .from("balances")
            .select("*") // Select all columns

        if (error) {
            return res.status(500).json({ message: "Failed to fetch balances", error: error.message });
        }

        return res.status(200).json({ message: "Balances retrieved successfully", balances: data });

    } catch (error) {
        console.error("Error in getAllBalances:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports = {
    logTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDate,
    setOpeningBalance,
    getOpeningBalance,
    getClosingBalance,
    getAllBalances
};
