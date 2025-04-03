const TellerModel = require("../models/tellerModel");
const BalanceModel = require("../models/balanceModel");

// ✅ Log a new transaction in the teller table
const logTransaction = async (req, res) => {
    try {
        const { amount, trans_type, acc_no, first_name, last_name, date } = req.body;

        if (!amount || !trans_type || !date) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const transaction = await TellerModel.createTransaction({
            amount, trans_type, acc_no, first_name, last_name, date
        });

        return res.status(201).json({ message: "Transaction logged successfully", transaction });
    } catch (error) {
        console.error("Error logging transaction:", error);
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

        const updatedTransaction = await TellerModel.updateTransaction(trans_id, { amount, trans_type });

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

        await TellerModel.deleteTransaction(trans_id);

        return res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Get all transactions by date
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
        const { date, open } = req.body;

        if (!date || open === undefined) {
            return res.status(400).json({ message: "Date and opening balance are required" });
        }

        await BalanceModel.setOpeningBalance(date, open);
        return res.status(200).json({ message: "Opening balance set successfully" });
    } catch (error) {
        console.error("Error setting opening balance:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Get opening balance for a given date
const getOpeningBalance = async (req, res) => {
    try {
        const { date } = req.params;
        const openBalance = await BalanceModel.getOpeningBalance(date);

        return res.status(200).json({ openBalance });
    } catch (error) {
        console.error("Error fetching opening balance:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Calculate closing balance based on transactions for the day
const getClosingBalance = async (req, res) => {
    try {
        const { date } = req.params;
        const closingBalance = await BalanceModel.calculateClosingBalance(date);

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
