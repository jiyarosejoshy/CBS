"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Clock, Upload, CheckCircle, XCircle, Landmark, Wallet, Copy } from 'lucide-react';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const OfflineTransactionPage = () => {
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [offlineTransactions, setOfflineTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    trans_type: 'deposit',
    acc_no: '',
    first_name: '',
    last_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [generatedTransId, setGeneratedTransId] = useState('');

  // Generate random transaction ID (8 alphanumeric characters)
  const generateTransactionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Check bank status and load transactions
  useEffect(() => {
    const checkBankStatus = async () => {
      const { data } = await supabase
        .from('bank_status')
        .select('is_open')
        .single();
      
      setIsBankOpen(data?.is_open || false);
    };

    const loadOfflineTransactions = async () => {
      const { data } = await supabase
        .from('offline_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setOfflineTransactions(data || []);
    };

    checkBankStatus();
    loadOfflineTransactions();

    // Set up realtime subscription
    const channel = supabase
      .channel('offline-transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offline_transactions' }, () => {
        loadOfflineTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });
    
    // Generate new transaction ID
    const transId = generateTransactionId();
    setGeneratedTransId(transId);

    try {
      const { error } = await supabase
        .from('offline_transactions')
        .insert([{
          ...formData,
          trans_id: transId,
          date: new Date().toISOString(),
          status: 'pending',
          teller_id: 'teller_001' // Replace with actual teller ID
        }]);

      if (error) throw error;

      setSubmitStatus({ 
        success: true, 
        message: 'Transaction logged successfully!',
        transId: transId
      });
      setFormData({
        amount: '',
        trans_type: 'deposit',
        acc_no: '',
        first_name: '',
        last_name: ''
      });
    } catch (error) {
      setSubmitStatus({ success: false, message: `Error: ${error.message}` });
      setGeneratedTransId('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTransId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Landmark className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Offline Transaction Log
                </CardTitle>
                <CardDescription className="text-blue-200">
                  {isBankOpen ? 'Bank is currently OPEN' : 'Bank is currently CLOSED'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Log New Transaction
            </CardTitle>
            <CardDescription>
              Record offline transactions when systems are down
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
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

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Log Transaction'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Transactions (only shown when bank is open) */}
        {isBankOpen && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Offline Transactions
              </CardTitle>
              <CardDescription>
                Transactions logged during system downtime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Account No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offlineTransactions.map((txn) => (
                    <TableRow key={txn.trans_id}>
                      <TableCell>{new Date(txn.date).toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{txn.trans_id}</TableCell>
                      <TableCell>{txn.acc_no}</TableCell>
                      <TableCell>{txn.first_name} {txn.last_name}</TableCell>
                      <TableCell>
                        <span className={`capitalize ${txn.trans_type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.trans_type.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${parseFloat(txn.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          txn.status === 'processed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {txn.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OfflineTransactionPage;

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