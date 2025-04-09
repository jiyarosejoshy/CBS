const express = require("express");
const router = express.Router();
const TellerController = require("../controllers/tellerController");

// ✅ Set the opening balance for a specific date
router.put('/opening-balance/:branch', TellerController.setOpeningBalance);

// ✅ Get the opening balance for a specific date
router.get('/opening-balance/:branch', TellerController.getOpeningBalance);

// ✅ View opening and closing balances for all dates
router.get('/balances', TellerController.getAllBalances);

// ✅ Log a new transaction
router.post('/transaction', TellerController.logTransaction);

// ✅ Update a transaction by trans_id
router.put('/transaction/:trans_id', TellerController.updateTransaction);

// ✅ Delete a transaction by trans_id
router.delete('/transaction/:trans_id', TellerController.deleteTransaction);

// ✅ Get all transactions for a specific date
router.get('/transactions/:date', TellerController.getTransactionsByDate);

// ✅ Calculate and get the closing balance for a specific date
router.get('/closing-balance/:date/:branch', TellerController.getClosingBalance);

module.exports = router;
