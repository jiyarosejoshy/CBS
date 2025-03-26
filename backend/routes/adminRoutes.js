const express = require('express');
const { getAccounts, getHighBalance, removeAccount, transfer } = require('../controllers/adminController');
const router = express.Router();

router.get('/accounts', getAccounts); // Display all account holders with balance
router.get('/high-balance', getHighBalance); // Get customers with balance > 10000
router.delete('/accounts/:id', removeAccount); // Delete account
router.post('/transfer', transfer); // Fund transfer

module.exports = router;
