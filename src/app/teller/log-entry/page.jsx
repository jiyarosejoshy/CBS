"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import NavBar from '@/components/ui/Navbar-teller';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Clock, CheckCircle, XCircle, Landmark, Wallet, Copy, BookOpen } from 'lucide-react';

const TellerLogSystem = () => {
  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    trans_type: 'deposit',
    acc_no: '',
    first_name: '',
    last_name: '',
    branch: ''
  });
  
  // Balance state
  const [openingBalance, setOpeningBalance] = useState(null);
  const [closingBalance, setClosingBalance] = useState(null);
  
  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Load initial data
  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString());
    const today = now.toISOString().split('T')[0];
    setCurrentDate(today);
    
    fetchTransactions(today);
    fetchBalances(today);
  }, []);

  const openBank = async () => {
    if (!openBalanceInput) {
      setSubmitStatus({ success: false, message: 'Please enter an opening balance' });
      return;
    }
  
    setIsProcessing(true);
    try {
      // Convert input to number
      const openingAmount = parseFloat(openBalanceInput);
  
      // 1. Post the opening balance to the backend
      const response = await axios.post("http://localhost:5000/api/teller/opening-balance", {
        amount: openingAmount,
        date: currentDate
      });
  
      setOpeningBalance(response.data.openBalance);
  
      // 2. Log this as an initial transaction
      const transaction = await axios.post("http://localhost:5000/api/teller/transaction", {
        amount: openingAmount,
        trans_type: "opening_balance",
        acc_no: "SYSTEM",
        first_name: "System",
        last_name: "Bank",
        branch: "Branch_name"
      });
  
      // Update transactions state
      setTransactions(prev => [transaction.data.transaction, ...prev]);
  
      setSubmitStatus({ success: true, message: "Bank opened successfully! Opening balance set." });
      setBankStatus("open");
      setOpenBalanceInput(""); // Reset input field
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: `Error: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };
  

  // Fetch transactions and balances for a date
  const fetchTransactions = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/teller/transaction/${date}`);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const setBalance = async(date)=>
  {
    try{
      const [openBalRes, closeBalRes] = await Promise.all([
        axios.post(`http://localhost:5000/api/teller/opening-balance`),
      ]);
    }
    
    catch(error)
    {
      console.error("Error posting balance : ",error);
    }
  }

  const fetchBalances = async (date) => {
    try {
      const [openBalRes, closeBalRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/teller/opening-balance/${date}`),
      ]);
      
      setOpeningBalance(openBalRes.data.openBalance);
      // setClosingBalance(closeBalRes.data.closingBalance);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Separate function to log transaction
  const logTransaction = async (transactionData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/teller/transaction", transactionData);
      return response.data.transaction;
    } catch (error) {
      console.error("Error logging transaction:", error);
      throw error;
    }
  };

  // Submit a new transaction
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      // Call the separate logTransaction function
      const newTransaction = await logTransaction({
        amount: formData.amount,
        trans_type: formData.trans_type,
        acc_no: formData.acc_no,
        first_name: formData.first_name,
        last_name: formData.last_name,
        branch: formData.branch,
      });

      setTransactions(prev => [newTransaction, ...prev]);
      fetchBalances(currentDate); // Refresh balances after new transaction
      
      setSubmitStatus({ 
        success: true, 
        message: 'Transaction logged successfully!',
        transactionId: newTransaction.trans_id // Use the ID from backend response
      });
      
      setFormData({
        amount: '',
        trans_type: 'deposit',
        acc_no: '',
        first_name: '',
        last_name: '',
        branch: '',
      });
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: `Error: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header with Balance Information */}
        <Card className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-700 rounded-lg">
                    <Landmark className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-4xl font-bold">
                      Teller Transaction Log
                    </CardTitle>
                    <CardDescription className="text-blue-200 text-lg mt-1">
                      Record and manage all banking transactions
                    </CardDescription>
                  </div>
                </div>
                
                <CardContent className="px-0">
                  <div className="space-y-4">
                    <p className="text-lg text-blue-100 leading-relaxed">
                      Maintain accurate financial records for all customer transactions.
                    </p>
                    {currentTime && (
                      <div className="flex items-center gap-2 text-blue-200">
                        <Clock className="h-5 w-5" />
                        <span>Current time: {currentTime} on {currentDate}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
              
              <div className="bg-blue-700/50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    <span>Opening Balance:</span>
                    <span className="font-bold">
                      {openingBalance !== null ? 
                        `₹${openingBalance.toLocaleString('en-IN')}` : 
                        'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    <span>Projected Closing:</span>
                    <span className="font-bold">
                      {closingBalance !== null ? 
                        `₹${closingBalance.toLocaleString('en-IN')}` : 
                        'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-lg text-blue-100">
                Total transactions today: {transactions.length}
              </p>
              {/* <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white/10"
                onClick={() => fetchBalances(currentDate)}
              >
                Refresh Balances
              </Button> */}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-800" />
              <CardTitle className="text-blue-800">Transaction Log</CardTitle>
            </div>
            <CardDescription className="text-blue-600">
              Record all customer transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTransaction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="trans_type">Transaction Type</Label>
                  <select
                    id="trans_type"
                    name="trans_type"
                    value={formData.trans_type}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="acc_no">Account Number</Label>
                  <Input
                    id="acc_no"
                    name="acc_no"
                    value={formData.acc_no}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {submitStatus.success && submitStatus.transactionId && (
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Transaction ID:</span>
                      <span className="font-mono">{submitStatus.transactionId}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(submitStatus.transactionId)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="mt-2 text-green-600">{submitStatus.message}</p>
                </div>
              )}

              {submitStatus.success === false && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  {submitStatus.message}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : 'Log Transaction'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Transactions
            </CardTitle>
            <CardDescription>
              All transactions processed today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Account No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <TableRow key={txn.trans_id}>
                      <TableCell>{new Date(txn.date).toLocaleTimeString()}</TableCell>
                      <TableCell className="font-mono">{txn.trans_id}</TableCell>
                      <TableCell>{txn.acc_no}</TableCell>
                      <TableCell>{txn.first_name} {txn.last_name}</TableCell>
                      <TableCell>
                        <span className={`capitalize ${txn.trans_type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.trans_type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {txn.trans_type === 'deposit' ? '+' : '-'}
                        {parseFloat(txn.amount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No transactions recorded yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TellerLogSystem;
