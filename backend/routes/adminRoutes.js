// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAllTransactionsByAdmin } = require('../controllers/transController');
const {getAccounts,removeAccount,getAllLoans,getLoanById,getPendingLoans,approveLoan,rejectLoan}=require('../controllers/adminController')
// Account management
router.get('/accounts', getAccounts);
router.delete('/accounts/:id', removeAccount);

// Loan management
router.get('/loans', getAllLoans);
router.get('/loans/pending', getPendingLoans);
router.get('/loans/:loanId', getLoanById);//aavasyilla
router.patch('/loans/:loanId/approve', approveLoan);
router.patch('/loans/:loanId/reject', rejectLoan);

// Transaction management

router.get('/transactions', getAllTransactionsByAdmin);
module.exports = router;