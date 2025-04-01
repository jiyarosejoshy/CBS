const { getAllAccountHolders, deleteAccount, transferFunds } = require('../models/adminModel');


// Display all account holders
const getAccounts = async (req, res) => {
  try {
    const accounts = await getAllAccountHolders();
    res.json(accounts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete an account
const removeAccount = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAccount(id);
    res.status(200).send('Account deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Fund transfer
const transfer = async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  try {
    const result = await transferFunds(fromAccountId, toAccountId, amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};



module.exports = {getAccounts, removeAccount, transfer };