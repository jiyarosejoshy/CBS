// routes/adminTransactionRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUserTransactions } = require('../controllers/adminController');

router.get('/transactions', getAllUserTransactions);

module.exports = router;