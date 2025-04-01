const express = require('express');
const { getAccounts, removeAccount, transfer } = require('../controllers/adminController');
const router = express.Router();

router.get('/accounts', getAccounts); 
router.delete('/accounts/:id', removeAccount); 
router.post('/transfer', transfer); 

module.exports = router;