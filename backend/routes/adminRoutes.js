// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Account management
router.get('/accounts', getAccounts);
router.delete('/accounts/:id', removeAccount);

// Loan management
router.get('/loans', getAllLoans);
router.get('/loans/pending', getPendingLoans);
router.get('/loans/:loanId', getLoanById);
router.patch('/loans/:loanId/approve', approveLoan);
router.patch('/loans/:loanId/reject', rejectLoan);

// Transaction management
router.use('/transactions', require('./adminTransactionRoutes'));

module.exports = router;