"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/Navbar-teller";
import { Label } from "@/components/ui/label";
import { Clock, BookOpen, Upload, Bookmark, Bell, User, Lock, Unlock, Wallet } from "lucide-react";

const TellerDashboard = () => {
  const [cashBalance, setCashBalance] = useState(50000);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // This will only run on client side
    setCurrentTime(new Date().toLocaleTimeString());
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const toggleBankStatus = () => {
    setIsBankOpen(!isBankOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Teller Operations Hero Section */}
        <Card className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-700 rounded-lg">
                    <Wallet className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-4xl font-bold">
                      Welcome to Teller Operations
                    </CardTitle>
                    <CardDescription className="text-blue-200 text-lg mt-1">
                      Your gateway to seamless banking services
                    </CardDescription>
                  </div>
                </div>
                
                <CardContent className="px-0">
                  <div className="space-y-4">
                    <p className="text-lg text-blue-100 leading-relaxed">
                      As a valued teller of our cooperative bank, you play a pivotal role in delivering 
                      exceptional service to our members while maintaining the highest standards of 
                      financial accuracy and security.
                    </p>
                    {currentTime && (
                      <div className="flex items-center gap-2 text-blue-200">
                        <Clock className="h-5 w-5" />
                        <span>Last login: Today at {currentTime}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white hover:bg-blue-700/50">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <div className="flex items-center space-x-2 bg-blue-700/50 px-3 py-1 rounded-full">
                  <User className="h-8 w-8 rounded-full bg-blue-500 p-1" />
                  <div>
                    <span className="font-medium">Teller 001</span>
                    <span className="block text-xs text-blue-300">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-lg text-blue-100">
                Your role is crucial in maintaining accurate transaction records and ensuring smooth daily operations.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-700 px-4 py-2 rounded-lg text-center">
                  <div className="text-blue-200 text-sm">Cash Balance</div>
                  <div className="text-2xl font-bold">₹{cashBalance.toLocaleString()}</div>
                </div>
                <Button 
                  onClick={toggleBankStatus}
                  className={`flex items-center gap-2 ${isBankOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isBankOpen ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  {isBankOpen ? 'Close Bank' : 'Open Bank'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
         {/* Teller Responsibilities Showcase */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-800" />
                <CardTitle className="text-blue-800">Opening/Closing Logs</CardTitle>
              </div>
              <CardDescription className="text-blue-600">
                Record and verify daily bank operations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Upload className="h-6 w-6 text-green-800" />
                <CardTitle className="text-green-800">Offline Transactions</CardTitle>
              </div>
              <CardDescription className="text-green-600">
                Process transactions when systems are down
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-800" />
                <CardTitle className="text-purple-800">Transaction Verification</CardTitle>
              </div>
              <CardDescription className="text-purple-600">
                Ensure all transactions are accurately recorded
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-teal-200 bg-teal-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bookmark className="h-6 w-6 text-teal-800" />
                <CardTitle className="text-teal-800">Daily Reconciliation</CardTitle>
              </div>
              <CardDescription className="text-teal-600">
                Balance cash and electronic transactions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Bank Status Card */}
        <Card className="w-full max-w-7xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              {isBankOpen ? (
                <Unlock className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-red-600" />
              )}
              <CardTitle>
                Bank is currently {isBankOpen ? "OPEN" : "CLOSED"}
              </CardTitle>
            </div>
            <CardDescription>
              {isBankOpen 
                ? "Remember to complete closing procedures at end of day"
                : "Open the bank to begin daily operations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Today's Date</Label>
                <span className="font-medium">{currentDate || "Loading..."}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label>Current Time</Label>
                <span className="font-medium">{currentTime || "Loading..."}</span>
              </div>
              <Button 
                onClick={toggleBankStatus}
                className={`w-full mt-2 ${isBankOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isBankOpen ? 'Begin Closing Procedures' : 'Open Bank for Business'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rest of your components... */}
      </div>
    </div>
  );
};

export default TellerDashboard;

// "use client";
// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import NavBar from "@/components/ui/Navbar-teller";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { DollarSign, Users, Clock, ArrowUpDown, Landmark, Wallet, Search, Bell, User } from "lucide-react";

// const TellerDashboard = () => {
//   const [cashOnHand, setCashOnHand] = useState(25000);
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // Sample data
//   const recentTransactions = [
//     { id: 1, member: "Maria Santos", type: "Deposit", amount: 5000, time: "10:30 AM" },
//     { id: 2, member: "Juan Dela Cruz", type: "Withdrawal", amount: -2000, time: "10:45 AM" },
//     { id: 3, member: "Lorna Reyes", type: "Loan Payment", amount: 1500, time: "11:15 AM" },
//     { id: 4, member: "Pedro Bautista", type: "Deposit", amount: 3000, time: "11:30 AM" },
//   ];

//   const quickAccessMembers = [
//     { id: 1, name: "Maria Santos", account: "CSB-1001", balance: 12500 },
//     { id: 2, name: "Juan Dela Cruz", account: "CSB-1002", balance: 8500 },
//     { id: 3, name: "Lorna Reyes", account: "CSB-1003", balance: 3200 },
//     { id: 4, name: "Pedro Bautista", account: "CSB-1004", balance: 15600 },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <NavBar />
//       <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
//         {/* Teller Dashboard Hero Section */}
//         <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//           <CardHeader>
//             <div className="flex justify-between items-start">
//               <div>
//                 <CardTitle className="text-3xl font-bold">
//                   Teller Operations Dashboard
//                 </CardTitle>
//                 <CardDescription className="text-blue-200">
//                   Serving our members with care and efficiency
//                 </CardDescription>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white">
//                   <Bell className="h-5 w-5" />
//                 </Button>
//                 <div className="flex items-center space-x-2">
//                   <User className="h-8 w-8 rounded-full bg-blue-500 p-1" />
//                   <span className="font-medium">Teller 001</span>
//                 </div>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex justify-between items-center">
//               <p className="text-lg text-blue-100">
//                 Today's transactions and member services at your fingertips
//               </p>
//               <div className="bg-blue-700 px-4 py-2 rounded-lg">
//                 <div className="text-blue-200 text-sm">Cash on Hand</div>
//                 <div className="text-2xl font-bold">₱{cashOnHand.toLocaleString()}</div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg">Deposit</CardTitle>
//                 <DollarSign className="h-6 w-6 text-green-600" />
//               </div>
//               <CardDescription>Accept member deposits</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button className="w-full" variant="outline">
//                 New Deposit
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg">Withdrawal</CardTitle>
//                 <ArrowUpDown className="h-6 w-6 text-blue-600" />
//               </div>
//               <CardDescription>Process withdrawals</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button className="w-full" variant="outline">
//                 New Withdrawal
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg">Loan Payment</CardTitle>
//                 <Landmark className="h-6 w-6 text-purple-600" />
//               </div>
//               <CardDescription>Accept loan payments</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button className="w-full" variant="outline">
//                 New Payment
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg">New Account</CardTitle>
//                 <Users className="h-6 w-6 text-teal-600" />
//               </div>
//               <CardDescription>Register new members</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button className="w-full" variant="outline">
//                 Create Account
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Transactions */}
//           <div className="space-y-6 lg:col-span-2">
//             {/* Recent Transactions */}
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-xl">Today's Transactions</CardTitle>
//                   <Button variant="ghost" size="sm">
//                     <Clock className="mr-2 h-4 w-4" />
//                     View All
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Member</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead className="text-right">Amount</TableHead>
//                       <TableHead>Time</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {recentTransactions.map((transaction) => (
//                       <TableRow key={transaction.id}>
//                         <TableCell className="font-medium">{transaction.member}</TableCell>
//                         <TableCell>{transaction.type}</TableCell>
//                         <TableCell className={`text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                           {transaction.amount > 0 ? '+' : ''}₱{Math.abs(transaction.amount).toLocaleString()}
//                         </TableCell>
//                         <TableCell>{transaction.time}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Quick Access */}
//           <div className="space-y-6">
//             {/* Member Quick Access */}
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-xl">Quick Member Access</CardTitle>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search members..."
//                       className="pl-9 w-[180px]"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {quickAccessMembers.map((member) => (
//                   <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <div className="bg-blue-100 p-2 rounded-full">
//                         <User className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="font-medium">{member.name}</p>
//                         <p className="text-sm text-gray-500">{member.account}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-medium">₱{member.balance.toLocaleString()}</p>
//                       <Button variant="link" size="sm" className="h-4 text-blue-600">
//                         View
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Cash Reconciliation */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-xl">Cash Reconciliation</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Starting Balance</span>
//                     <span className="font-medium">₱25,000.00</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Total Deposits</span>
//                     <span className="text-green-600 font-medium">+₱8,000.00</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Total Withdrawals</span>
//                     <span className="text-red-600 font-medium">-₱2,000.00</span>
//                   </div>
//                   <div className="border-t pt-3 flex justify-between">
//                     <span className="font-medium">Expected Balance</span>
//                     <span className="font-bold">₱31,000.00</span>
//                   </div>
//                   <Button className="w-full mt-4">Reconcile Now</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TellerDashboard;
// "use client";
// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";
// import Navbar from "@/components/ui/Navbar-admin";

// // Define columns for DataGrid
// const columns = [
//   { field: "accountNumber", headerName: "Account Number", width: 150 },
//   { field: "firstName", headerName: "First Name", width: 130 },
//   { field: "lastName", headerName: "Last Name", width: 130 },
//   { field: "creditDebit", headerName: "Credit/Debit", width: 150 },
//   { field: "balance", headerName: "Balance", width: 160 },
//   {
//     field: "timestamp",
//     headerName: "Transaction Time",
//     width: 200,
//     renderCell: (params) => new Date(params.value).toLocaleString(), // Format timestamp
//   },
// ];

// export default function DataTable() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isRealtime, setIsRealtime] = useState(false);

//   useEffect(() => {
//     let supabase;
//     let subscription;

//     const setupRealtime = async () => {
//       try {
//         // Dynamically import Supabase to avoid SSR issues
//         const { createClient } = await import('@supabase/supabase-js');
        
//         const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//         const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
//         // Check if Supabase credentials are available
//         if (!supabaseUrl || !supabaseKey) {
//           console.warn('Supabase credentials not found. Falling back to REST API.');
//           setIsRealtime(false);
//           return;
//         }
        
//         // Initialize Supabase client
//         supabase = createClient(supabaseUrl, supabaseKey);
        
//         // Set up real-time subscription for transactions
//         subscription = supabase
//           .channel('transactions-channel')
//           .on('postgres_changes', { 
//             event: 'INSERT', 
//             schema: 'public', 
//             table: 'transactions' 
//           }, payload => {
//             console.log('New transaction added:', payload.new);
//             // Format and add the new transaction to state
//             const newTransaction = {
//               id: payload.new.trans_id,
//               accountNumber: payload.new.account_no,
//               firstName: payload.new.first_name,
//               lastName: payload.new.last_name,
//               creditDebit: payload.new.type,
//               balance: payload.new.balance,
//               timestamp: payload.new.transac_time,
//             };
//             setRows(currentRows => [newTransaction, ...currentRows]);
//           })
//           .subscribe((status) => {
//             if (status === 'SUBSCRIBED') {
//               console.log('Real-time subscription enabled');
//               setIsRealtime(true);
//             }
//           });
          
//         console.log('Supabase real-time setup complete');
//       } catch (error) {
//         console.error('Error setting up real-time:', error);
//         setIsRealtime(false);
//       }
//     };

//     // Setup polling for non-realtime updates as fallback
//     let pollingInterval;
    
//     // Initial fetch of data
//     fetchTransactions();
    
//     // Try to set up real-time updates
//     setupRealtime();
    
//     // Set up polling as a fallback if real-time isn't available
//     // This will be cleared if real-time is successfully established
//     pollingInterval = setInterval(() => {
//       if (!isRealtime) {
//         console.log('Polling for updates...');
//         fetchTransactions();
//       }
//     }, 30000); // Poll every 30 seconds

//     // Cleanup on unmount
//     return () => {
//       if (subscription && supabase) {
//         supabase.removeChannel(subscription);
//       }
//       if (pollingInterval) {
//         clearInterval(pollingInterval);
//       }
//     };
//   }, [isRealtime]);

//   async function fetchTransactions() {
//     try {
//       setLoading(true);
      
//       const response = await fetch("http://localhost:5000/admin/transactions");
//       if (!response.ok) {
//         throw new Error("Failed to fetch transactions");
//       }
//       const data = await response.json();

//       // Map API response to match DataGrid columns
//       const formattedData = data.map((transaction) => ({
//         id: transaction.trans_id,
//         accountNumber: transaction.account_no,
//         firstName: transaction.first_name,
//         lastName: transaction.last_name,
//         creditDebit: transaction.type,
//         balance: transaction.balance,
//         timestamp: transaction.transac_time,
//       }));
      
//       console.log('Fetched transactions:', formattedData.length);
//       setRows(formattedData);
//     } catch (error) {
//       setErrorMessage(`Error fetching transactions: ${error.message}`);
//       console.error('Error fetching transactions:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="flex flex-col justify-center items-center gap-10 h-screen">
//         <div className="text-4xl font-semibold">Admin Panel</div>
//         {isRealtime && (
//           <div className="text-green-600 text-sm">Real-time updates enabled</div>
//         )}
//         {errorMessage && (
//           <div className="text-red-600 mb-4">{errorMessage}</div>
//         )}
//         <div className="w-3/4">
//           <Paper sx={{ height: 500, width: "100%" }}>
//             <DataGrid
//               rows={rows}
//               columns={columns}
//               pageSizeOptions={[5, 10, 25]}
//               initialState={{
//                 pagination: {
//                   paginationModel: { pageSize: 10 },
//                 },
//               }}
//               pagination
//               loading={loading}
//               sx={{ border: 0 }}
//               disableRowSelectionOnClick
//             />
//           </Paper>
//         </div>
//       </div>
//     </div>
//   );
// } 

