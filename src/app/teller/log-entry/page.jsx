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
    last_name: ''
  });
  
  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [generatedTransId, setGeneratedTransId] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Generate random transaction ID
  const generateTransactionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({length: 8}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  // Load initial data
  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString());
    setCurrentDate(now.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    fetchTransactions();
  }, []);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/teller/transactions/${currentDate}`);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit a new transaction
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setSubmitStatus({ success: null, message: '' });
    
    const transId = generateTransactionId();
    setGeneratedTransId(transId);

    try {
      const response = await axios.post('/api/teller/transaction', {
        amount: formData.amount,
        trans_type: formData.trans_type,
        acc_no: formData.acc_no,
        first_name: formData.first_name,
        last_name: formData.last_name
      });

      setTransactions(prev => [response.data.transaction, ...prev]);
      setSubmitStatus({ 
        success: true, 
        message: 'Transaction logged successfully!'
      });
      setFormData({
        amount: '',
        trans_type: 'deposit',
        acc_no: '',
        first_name: '',
        last_name: ''
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTransId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-lg text-blue-100">
                Total transactions today: {transactions.length}
              </p>
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
              </div>

              {submitStatus.success && generatedTransId && (
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Transaction ID:</span>
                      <span className="font-mono">{generatedTransId}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
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

// "use client";
// import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import NavBar from '@/components/ui/Navbar-teller';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
// import { Clock, Upload, CheckCircle, XCircle, Landmark, Wallet, Copy, ChevronsUpDown } from 'lucide-react';

// // Initialize Supabase
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const OfflineTransactionPage = () => {
//   const [isBankOpen, setIsBankOpen] = useState(false);
//   const [offlineTransactions, setOfflineTransactions] = useState([]);
//   const [formData, setFormData] = useState({
//     amount: '',
//     trans_type: 'deposit',
//     acc_no: '',
//     first_name: '',
//     last_name: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
//   const [generatedTransId, setGeneratedTransId] = useState('');
//   const [openBalance, setOpenBalance] = useState(0);
//   const [closeBalance, setCloseBalance] = useState(0);
//   const [calculatedBalance, setCalculatedBalance] = useState(0);
//   const [balanceDiscrepancy, setBalanceDiscrepancy] = useState(0);
//   const [isClosingBank, setIsClosingBank] = useState(false);

//   // Generate random transaction ID (8 alphanumeric characters)
//   const generateTransactionId = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let result = '';
//     for (let i = 0; i < 8; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   };

//   // Check bank status and load transactions
//   useEffect(() => {
//     const checkBankStatus = async () => {
//       const { data } = await supabase
//         .from('bank_status')
//         .select('is_open, open_balance')
//         .single();
      
//       setIsBankOpen(data?.is_open || false);
//       setOpenBalance(data?.open_balance || 0);
//     };

//     const loadOfflineTransactions = async () => {
//       const { data } = await supabase
//         .from('offline_transactions')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(50);
      
//       setOfflineTransactions(data || []);
//     };

//     checkBankStatus();
//     loadOfflineTransactions();

//     // Set up realtime subscription
//     const channel = supabase
//       .channel('offline-transactions')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'offline_transactions' }, () => {
//         loadOfflineTransactions();
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   // Calculate balance whenever transactions change
//   useEffect(() => {
//     if (isBankOpen) {
//       const calculated = offlineTransactions.reduce((total, txn) => {
//         return txn.trans_type === 'deposit' 
//           ? total + parseFloat(txn.amount) 
//           : total - parseFloat(txn.amount);
//       }, openBalance);
//       setCalculatedBalance(calculated);
//     }
//   }, [offlineTransactions, openBalance, isBankOpen]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus({ success: null, message: '' });
    
//     // Generate new transaction ID
//     const transId = generateTransactionId();
//     setGeneratedTransId(transId);

//     try {
//       const { error } = await supabase
//         .from('offline_transactions')
//         .insert([{
//           ...formData,
//           trans_id: transId,
//           date: new Date().toISOString(),
//           status: 'pending',
//           teller_id: 'teller_001' // Replace with actual teller ID
//         }]);

//       if (error) throw error;

//       setSubmitStatus({ 
//         success: true, 
//         message: 'Transaction logged successfully!',
//         transId: transId
//       });
//       setFormData({
//         amount: '',
//         trans_type: 'deposit',
//         acc_no: '',
//         first_name: '',
//         last_name: ''
//       });
//     } catch (error) {
//       setSubmitStatus({ success: false, message: `Error: ${error.message}` });
//       setGeneratedTransId('');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCloseBank = async () => {
//     setIsClosingBank(true);
//     try {
//       // Calculate discrepancy
//       const discrepancy = closeBalance - calculatedBalance;
//       setBalanceDiscrepancy(discrepancy);

//       // Update bank status in database
//       const { error } = await supabase
//         .from('bank_status')
//         .update({ 
//           is_open: false,
//           close_balance: closeBalance,
//           last_close_date: new Date().toISOString(),
//           discrepancy: discrepancy
//         })
//         .eq('is_open', true);

//       if (error) throw error;

//       setIsBankOpen(false);
//       setSubmitStatus({ 
//         success: true, 
//         message: `Bank closed successfully. ${discrepancy !== 0 ? 'Discrepancy found!' : 'Balances matched!'}`
//       });
//     } catch (error) {
//       setSubmitStatus({ success: false, message: `Error closing bank: ${error.message}` });
//     } finally {
//       setIsClosingBank(false);
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(generatedTransId);
//   };

//   return (
//     <div>
//       <NavBar/>
    
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <Card className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
//           <CardHeader>
//             <div className="flex items-center gap-4">
//               <Landmark className="h-8 w-8" />
//               <div>
//                 <CardTitle className="text-2xl font-bold">
//                   Offline Transaction Log
//                 </CardTitle>
//                 <CardDescription className="text-blue-200">
//                   {isBankOpen ? 'Bank is currently OPEN' : 'Bank is currently CLOSED'}
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {isBankOpen && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
//                 <div className="bg-blue-700/50 p-4 rounded-lg">
//                   <div className="text-blue-200 text-sm">Opening Balance</div>
//                   <div className="text-2xl font-bold">₹{openBalance.toLocaleString()}</div>
//                 </div>
//                 <div className="bg-blue-700/50 p-4 rounded-lg">
//                   <div className="text-blue-200 text-sm">Calculated Balance</div>
//                   <div className="text-2xl font-bold">₹{calculatedBalance.toLocaleString()}</div>
//                 </div>
//                 <div className="bg-blue-700/50 p-4 rounded-lg">
//                   <div className="text-blue-200 text-sm">Transactions Today</div>
//                   <div className="text-2xl font-bold">{offlineTransactions.length}</div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Transaction Form */}
//         {isBankOpen && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Wallet className="h-5 w-5" />
//                 Log New Transaction
//               </CardTitle>
//               <CardDescription>
//                 Record offline transactions when systems are down
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="amount">Amount</Label>
//                     <Input
//                       id="amount"
//                       name="amount"
//                       type="number"
//                       value={formData.amount}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="trans_type">Transaction Type</Label>
//                     <select
//                       id="trans_type"
//                       name="trans_type"
//                       value={formData.trans_type}
//                       onChange={handleInputChange}
//                       className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                       required
//                     >
//                       <option value="deposit">Deposit</option>
//                       <option value="withdrawal">Withdrawal</option>
//                     </select>
//                   </div>
//                   <div>
//                     <Label htmlFor="acc_no">Account Number</Label>
//                     <Input
//                       id="acc_no"
//                       name="acc_no"
//                       value={formData.acc_no}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="first_name">First Name</Label>
//                     <Input
//                       id="first_name"
//                       name="first_name"
//                       value={formData.first_name}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="last_name">Last Name</Label>
//                     <Input
//                       id="last_name"
//                       name="last_name"
//                       value={formData.last_name}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {submitStatus.success && generatedTransId && (
//                   <div className="bg-green-50 p-4 rounded-md border border-green-200">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-green-800">
//                         <CheckCircle className="h-5 w-5" />
//                         <span className="font-medium">Transaction ID:</span>
//                         <span className="font-mono">{generatedTransId}</span>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={copyToClipboard}
//                         className="text-green-600 hover:text-green-800"
//                       >
//                         <Copy className="h-4 w-4 mr-2" />
//                         Copy
//                       </Button>
//                     </div>
//                     <p className="mt-2 text-green-600">{submitStatus.message}</p>
//                   </div>
//                 )}

//                 {submitStatus.success === false && (
//                   <div className="flex items-center gap-2 text-red-600">
//                     <XCircle className="h-5 w-5" />
//                     {submitStatus.message}
//                   </div>
//                 )}

//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? 'Processing...' : 'Log Transaction'}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* Close Bank Section */}
//         {isBankOpen && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <ChevronsUpDown className="h-5 w-5" />
//                 End of Day Procedures
//               </CardTitle>
//               <CardDescription>
//                 Close the bank and verify daily transactions
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="closeBalance">Closing Cash Balance</Label>
//                     <Input
//                       id="closeBalance"
//                       type="number"
//                       value={closeBalance}
//                       onChange={(e) => setCloseBalance(parseFloat(e.target.value))}
//                       required
//                     />
//                   </div>
//                   <div className="flex items-end">
//                     <Button 
//                       onClick={handleCloseBank}
//                       disabled={isClosingBank}
//                       className={`w-full ${balanceDiscrepancy !== 0 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
//                     >
//                       {isClosingBank ? 'Processing...' : 'Close Bank'}
//                     </Button>
//                   </div>
//                 </div>
                
//                 {balanceDiscrepancy !== 0 && (
//                   <div className={`p-4 rounded-md ${balanceDiscrepancy > 0 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
//                     <div className="flex items-center gap-2">
//                       {balanceDiscrepancy > 0 ? (
//                         <>
//                           <span className="font-medium">Surplus detected:</span>
//                           <span>₹{Math.abs(balanceDiscrepancy).toLocaleString()}</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="font-medium">Shortage detected:</span>
//                           <span>₹{Math.abs(balanceDiscrepancy).toLocaleString()}</span>
//                         </>
//                       )}
//                     </div>
//                     <p className="mt-2 text-sm">
//                       {balanceDiscrepancy > 0 
//                         ? 'Please verify all transactions and cash counts.'
//                         : 'Please review transactions for possible errors.'}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Recent Transactions (only shown when bank is open) */}
//         {isBankOpen && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 Today's Offline Transactions
//               </CardTitle>
//               <CardDescription>
//                 Transactions logged during system downtime
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Time</TableHead>
//                     <TableHead>Transaction ID</TableHead>
//                     <TableHead>Account No.</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead className="text-right">Amount</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {offlineTransactions.map((txn) => (
//                     <TableRow key={txn.trans_id}>
//                       <TableCell>{new Date(txn.date).toLocaleTimeString()}</TableCell>
//                       <TableCell className="font-mono">{txn.trans_id}</TableCell>
//                       <TableCell>{txn.acc_no}</TableCell>
//                       <TableCell>{txn.first_name} {txn.last_name}</TableCell>
//                       <TableCell>
//                         <span className={`capitalize ${txn.trans_type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
//                           {txn.trans_type}
//                         </span>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {txn.trans_type === 'deposit' ? '+' : '-'}₹{parseFloat(txn.amount).toFixed(2)}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default OfflineTransactionPage;

// "use client";
// import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
// import { Clock, Upload, CheckCircle, XCircle, Landmark, Wallet, Copy } from 'lucide-react';

// // Initialize Supabase
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const OfflineTransactionPage = () => {
//   const [isBankOpen, setIsBankOpen] = useState(false);
//   const [offlineTransactions, setOfflineTransactions] = useState([]);
//   const [formData, setFormData] = useState({
//     amount: '',
//     trans_type: 'deposit',
//     acc_no: '',
//     first_name: '',
//     last_name: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
//   const [generatedTransId, setGeneratedTransId] = useState('');

//   // Generate random transaction ID (8 alphanumeric characters)
//   const generateTransactionId = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let result = '';
//     for (let i = 0; i < 8; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   };

//   // Check bank status and load transactions
//   useEffect(() => {
//     const checkBankStatus = async () => {
//       const { data } = await supabase
//         .from('bank_status')
//         .select('is_open')
//         .single();
      
//       setIsBankOpen(data?.is_open || false);
//     };

//     const loadOfflineTransactions = async () => {
//       const { data } = await supabase
//         .from('offline_transactions')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(50);
      
//       setOfflineTransactions(data || []);
//     };

//     checkBankStatus();
//     loadOfflineTransactions();

//     // Set up realtime subscription
//     const channel = supabase
//       .channel('offline-transactions')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'offline_transactions' }, () => {
//         loadOfflineTransactions();
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus({ success: null, message: '' });
    
//     // Generate new transaction ID
//     const transId = generateTransactionId();
//     setGeneratedTransId(transId);

//     try {
//       const { error } = await supabase
//         .from('offline_transactions')
//         .insert([{
//           ...formData,
//           trans_id: transId,
//           date: new Date().toISOString(),
//           status: 'pending',
//           teller_id: 'teller_001' // Replace with actual teller ID
//         }]);

//       if (error) throw error;

//       setSubmitStatus({ 
//         success: true, 
//         message: 'Transaction logged successfully!',
//         transId: transId
//       });
//       setFormData({
//         amount: '',
//         trans_type: 'deposit',
//         acc_no: '',
//         first_name: '',
//         last_name: ''
//       });
//     } catch (error) {
//       setSubmitStatus({ success: false, message: `Error: ${error.message}` });
//       setGeneratedTransId('');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(generatedTransId);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <Card className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
//           <CardHeader>
//             <div className="flex items-center gap-4">
//               <Landmark className="h-8 w-8" />
//               <div>
//                 <CardTitle className="text-2xl font-bold">
//                   Offline Transaction Log
//                 </CardTitle>
//                 <CardDescription className="text-blue-200">
//                   {isBankOpen ? 'Bank is currently OPEN' : 'Bank is currently CLOSED'}
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//         </Card>

//         {/* Transaction Form */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Wallet className="h-5 w-5" />
//               Log New Transaction
//             </CardTitle>
//             <CardDescription>
//               Record offline transactions when systems are down
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="amount">Amount</Label>
//                   <Input
//                     id="amount"
//                     name="amount"
//                     type="number"
//                     value={formData.amount}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="trans_type">Transaction Type</Label>
//                   <select
//                     id="trans_type"
//                     name="trans_type"
//                     value={formData.trans_type}
//                     onChange={handleInputChange}
//                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                     required
//                   >
//                     <option value="deposit">Deposit</option>
//                     <option value="withdrawal">Withdrawal</option>
//                   </select>
//                 </div>
//                 <div>
//                   <Label htmlFor="acc_no">Account Number</Label>
//                   <Input
//                     id="acc_no"
//                     name="acc_no"
//                     value={formData.acc_no}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="first_name">First Name</Label>
//                   <Input
//                     id="first_name"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="last_name">Last Name</Label>
//                   <Input
//                     id="last_name"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//               </div>

//               {submitStatus.success && generatedTransId && (
//                 <div className="bg-green-50 p-4 rounded-md border border-green-200">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2 text-green-800">
//                       <CheckCircle className="h-5 w-5" />
//                       <span className="font-medium">Transaction ID:</span>
//                       <span className="font-mono">{generatedTransId}</span>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={copyToClipboard}
//                       className="text-green-600 hover:text-green-800"
//                     >
//                       <Copy className="h-4 w-4 mr-2" />
//                       Copy
//                     </Button>
//                   </div>
//                   <p className="mt-2 text-green-600">{submitStatus.message}</p>
//                 </div>
//               )}

//               {submitStatus.success === false && (
//                 <div className="flex items-center gap-2 text-red-600">
//                   <XCircle className="h-5 w-5" />
//                   {submitStatus.message}
//                 </div>
//               )}

//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? 'Processing...' : 'Log Transaction'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Recent Transactions (only shown when bank is open) */}
//         {isBankOpen && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 Recent Offline Transactions
//               </CardTitle>
//               <CardDescription>
//                 Transactions logged during system downtime
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Transaction ID</TableHead>
//                     <TableHead>Account No.</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead className="text-right">Amount</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {offlineTransactions.map((txn) => (
//                     <TableRow key={txn.trans_id}>
//                       <TableCell>{new Date(txn.date).toLocaleString()}</TableCell>
//                       <TableCell className="font-mono">{txn.trans_id}</TableCell>
//                       <TableCell>{txn.acc_no}</TableCell>
//                       <TableCell>{txn.first_name} {txn.last_name}</TableCell>
//                       <TableCell>
//                         <span className={`capitalize ${txn.trans_type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
//                           {txn.trans_type.replace('_', ' ')}
//                         </span>
//                       </TableCell>
//                       <TableCell className="text-right">${parseFloat(txn.amount).toFixed(2)}</TableCell>
//                       <TableCell>
//                         <span className={`px-2 py-1 rounded-full text-xs ${
//                           txn.status === 'processed' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {txn.status}
//                         </span>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OfflineTransactionPage;

// "use client";
// import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
// import { Clock, Upload, CheckCircle, XCircle, Landmark, Wallet } from 'lucide-react';

// // Initialize Supabase
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const OfflineTransactionPage = () => {
//   const [isBankOpen, setIsBankOpen] = useState(false);
//   const [offlineTransactions, setOfflineTransactions] = useState([]);
//   const [formData, setFormData] = useState({
//     trans_id: '',
//     amount: '',
//     trans_type: 'deposit',
//     acc_no: '',
//     first_name: '',
//     last_name: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

//   // Check bank status and load transactions
//   useEffect(() => {
//     const checkBankStatus = async () => {
//       const { data } = await supabase
//         .from('bank_status')
//         .select('is_open')
//         .single();
      
//       setIsBankOpen(data?.is_open || false);
//     };

//     const loadOfflineTransactions = async () => {
//       const { data } = await supabase
//         .from('offline_transactions')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(50);
      
//       setOfflineTransactions(data || []);
//     };

//     checkBankStatus();
//     loadOfflineTransactions();

//     // Set up realtime subscription
//     const channel = supabase
//       .channel('offline-transactions')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'offline_transactions' }, () => {
//         loadOfflineTransactions();
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus({ success: null, message: '' });

//     try {
//       const { error } = await supabase
//         .from('offline_transactions')
//         .insert([{
//           ...formData,
//           date: new Date().toISOString(),
//           status: 'pending',
//           teller_id: 'teller_001' // Replace with actual teller ID
//         }]);

//       if (error) throw error;

//       setSubmitStatus({ success: true, message: 'Transaction logged successfully!' });
//       setFormData({
//         trans_id: '',
//         amount: '',
//         trans_type: 'deposit',
//         acc_no: '',
//         first_name: '',
//         last_name: ''
//       });
//     } catch (error) {
//       setSubmitStatus({ success: false, message: `Error: ${error.message}` });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <Card className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
//           <CardHeader>
//             <div className="flex items-center gap-4">
//               <Landmark className="h-8 w-8" />
//               <div>
//                 <CardTitle className="text-2xl font-bold">
//                   Offline Transaction Log
//                 </CardTitle>
//                 <CardDescription className="text-blue-200">
//                   {isBankOpen ? 'Bank is currently OPEN' : 'Bank is currently CLOSED'}
//                 </CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//         </Card>

//         {/* Transaction Form */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Wallet className="h-5 w-5" />
//               Log New Transaction
//             </CardTitle>
//             <CardDescription>
//               Record offline transactions when systems are down
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="trans_id">Transaction ID</Label>
//                   <Input
//                     id="trans_id"
//                     name="trans_id"
//                     value={formData.trans_id}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="amount">Amount</Label>
//                   <Input
//                     id="amount"
//                     name="amount"
//                     type="number"
//                     value={formData.amount}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="trans_type">Transaction Type</Label>
//                   <select
//                     id="trans_type"
//                     name="trans_type"
//                     value={formData.trans_type}
//                     onChange={handleInputChange}
//                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                     required
//                   >
//                     <option value="deposit">Deposit</option>
//                     <option value="withdrawal">Withdrawal</option>
//                     <option value="loan_payment">Loan Payment</option>
//                   </select>
//                 </div>
//                 <div>
//                   <Label htmlFor="acc_no">Account Number</Label>
//                   <Input
//                     id="acc_no"
//                     name="acc_no"
//                     value={formData.acc_no}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="first_name">First Name</Label>
//                   <Input
//                     id="first_name"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="last_name">Last Name</Label>
//                   <Input
//                     id="last_name"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//               </div>

//               {submitStatus.message && (
//                 <div className={`flex items-center gap-2 ${submitStatus.success ? 'text-green-600' : 'text-red-600'}`}>
//                   {submitStatus.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
//                   {submitStatus.message}
//                 </div>
//               )}

//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? 'Processing...' : 'Log Transaction'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Recent Transactions (only shown when bank is open) */}
//         {isBankOpen && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 Recent Offline Transactions
//               </CardTitle>
//               <CardDescription>
//                 Transactions logged during system downtime
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Transaction ID</TableHead>
//                     <TableHead>Account No.</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead className="text-right">Amount</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {offlineTransactions.map((txn) => (
//                     <TableRow key={txn.trans_id}>
//                       <TableCell>{new Date(txn.date).toLocaleString()}</TableCell>
//                       <TableCell>{txn.trans_id}</TableCell>
//                       <TableCell>{txn.acc_no}</TableCell>
//                       <TableCell>{txn.first_name} {txn.last_name}</TableCell>
//                       <TableCell>
//                         <span className={`capitalize ${txn.trans_type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
//                           {txn.trans_type.replace('_', ' ')}
//                         </span>
//                       </TableCell>
//                       <TableCell className="text-right">${parseFloat(txn.amount).toFixed(2)}</TableCell>
//                       <TableCell>
//                         <span className={`px-2 py-1 rounded-full text-xs ${
//                           txn.status === 'processed' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {txn.status}
//                         </span>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OfflineTransactionPage;