"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/NavBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Copy, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Chatbot from "./components/chatbot";

const CooperativeAccountPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/123e4567-e89b-12d3-a456-426614174001"
        );
        
        if (response.data?.accounts?.length > 0) {
          setAccount({
            account_no: response.data.accounts[0].account_no || "N/A",
            balance: response.data.accounts[0].balance || 0
          });
        } else {
          setAccount({
            account_no: "No Account",
            balance: 0
          });
        }
      } catch (error) {
        setAccount({
          account_no: "Error Loading",
          balance: 0
        });
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/123e4567-e89b-12d3-a456-426614174001"
        );
        
        if (response.data) {
          setUser({
            name: response.data.name || "Community Member",
            email: response.data.email || "member@ourcoop.org",
            joinDate: "January 15, 2020"
          });
        }
      } catch (error) {
        setUser({
          name: "Community Member",
          email: "member@ourcoop.org",
          joinDate: "January 15, 2020"
        });
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
    fetchUserDetails();
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-800">
              Welcome back, {user?.name || "Valued Member"}!
            </CardTitle>
            <CardDescription className="text-blue-700">
              Together we grow stronger - Your cooperative since {user?.joinDate}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Account Overview */}
          <div className="space-y-6 lg:col-span-2">
            {/* Account Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Cooperative Account</CardTitle>
                <CardDescription>Member-owned banking at its best</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-600">Member Since</Label>
                    <p className="text-lg font-medium">{user?.joinDate || "Loading..."}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Member ID</Label>
                    <p className="text-lg font-medium">
                      {account ? account.account_no : "Loading..."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Available Balance</Label>
                    <p className="text-3xl font-bold text-green-600">
                      {account ? `₹${account.balance.toLocaleString()}` : "Loading..."}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/user/transaction")}
                  >
                    Make a Transfer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-600 text-blue-600"
                    onClick={() => router.push("/user/account")}
                  >
                    Deposit Funds
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-green-600 text-green-600"
                    onClick={() => router.push("/user/loan")}
                  >
                    Apply for Loan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Recent Community Transactions</CardTitle>
                <CardDescription>Your shared financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500">Loading transactions...</p>
                  </div>
                ) : transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Date & Time</TableHead>
                        <TableHead>Transaction Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.trans_id}>
                          <TableCell className="font-medium">
                            {new Date(tx.transac_time).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              tx.type === "Deposit" 
                                ? "text-green-500" 
                                : "text-red-500"
                            }`}>
                              {tx.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{tx.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Community & Support */}
          <div className="space-y-6">
            {/* Community Benefits Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-800">
                  Member Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Need Help?</h4>
                  <p className="text-sm text-gray-600">
                    Our member services team is here for you
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Options</Label>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="mr-2">📞</span> 1800-123-4567 (24/7)
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✉️</span> support@ourcoop.org
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🏢</span> Visit your local branch
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events Card */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800">
                  Community Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Annual General Meeting</h4>
                  <p className="text-sm text-gray-600">
                    June 15, 2023 • 6:00 PM <br/>
                    Community Center
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Financial Literacy Workshop</h4>
                  <p className="text-sm text-gray-600">
                    July 5, 2023 • 5:30 PM <br/>
                    Online via Zoom
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Join the Movement Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Strengthen Our Cooperative
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Help grow our member-owned financial alternative that puts people before profits.
                </p>
                <Button 
                  className="w-full bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  onClick={() => setShowInviteOptions(!showInviteOptions)}
                >
                  Invite New Members
                </Button>
                
                {showInviteOptions && (
                  <div className="mt-4">
                    <Card className="bg-white/10 border-white/20">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-white/90">WhatsApp Group Link</Label>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20"
                              onClick={() => {
                                navigator.clipboard.writeText("https://chat.whatsapp.com/BankERPCommunityLocality");
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20"
                              onClick={() => window.open("https://chat.whatsapp.com/BankERPCommunityLocality", "_blank")}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-md border border-white/10">
                          <p className="font-mono text-sm text-white break-all">
                            https://chat.whatsapp.com/BankERPCommunityLocality
                          </p>
                        </div>
                        <p className="text-sm text-white/70">
                          Share this link to invite new members to our cooperative banking community
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};


export default CooperativeAccountPage;
// "use client";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import NavBar from "@/components/ui/NavBar";

// function BankERPDashboard() {
//   return (
//     <div className="min-h-screen">
//       {/* Background with overlay */}
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 z-0"></div>
      
//       <div className="relative z-10">
//         <NavBar />
        
//         <div className="max-w-6xl mx-auto p-6">
//           {/* Hero Section */}
//           <div className="text-center py-16">
//             <h1 className="text-5xl font-bold text-gray-800 mb-4">BANK ERP</h1>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               The Ultimate Enterprise Resource Planning Solution for Modern Banking Operations
//             </p>
//           </div>

//           {/* Features Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//             <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
//               <div className="text-blue-600 text-4xl mb-4">⚡</div>
//               <h3 className="text-xl font-semibold mb-2">Real-time Transactions</h3>
//               <p className="text-gray-600">Process deposits, withdrawals, and transfers instantly with our high-performance banking engine.</p>
//             </div>
            
//             <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
//               <div className="text-blue-600 text-4xl mb-4">🔒</div>
//               <h3 className="text-xl font-semibold mb-2">Military-grade Security</h3>
//               <p className="text-gray-600">256-bit encryption and multi-factor authentication protect all your financial data.</p>
//             </div>
            
//             <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
//               <div className="text-blue-600 text-4xl mb-4">📊</div>
//               <h3 className="text-xl font-semibold mb-2">Comprehensive Analytics</h3>
//               <p className="text-gray-600">Advanced reporting tools give you insights into all banking operations.</p>
//             </div>
//           </div>

//           {/* How It Works Section */}
//           <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-16 border border-gray-200">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">How BANK ERP Works</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="text-center">
//                 <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 text-2xl mb-3">1</div>
//                 <h3 className="font-medium mb-2">User Authentication</h3>
//                 <p className="text-sm text-gray-500">Secure login with role-based access control</p>
//               </div>
              
//               <div className="text-center">
//                 <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 text-2xl mb-3">2</div>
//                 <h3 className="font-medium mb-2">Transaction Processing</h3>
//                 <p className="text-sm text-gray-500">Execute financial operations in real-time</p>
//               </div>
              
//               <div className="text-center">
//                 <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 text-2xl mb-3">3</div>
//                 <h3 className="font-medium mb-2">Data Synchronization</h3>
//                 <p className="text-sm text-gray-500">Automatic updates across all modules</p>
//               </div>
              
//               <div className="text-center">
//                 <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-blue-600 text-2xl mb-3">4</div>
//                 <h3 className="font-medium mb-2">Reporting & Analysis</h3>
//                 <p className="text-sm text-gray-500">Generate insights and compliance reports</p>
//               </div>
//             </div>
//           </div>

//           {/* Terms & Conditions Section */}
//           <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-16 border border-gray-200">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6">Terms & Conditions</h2>
            
//             <div className="prose max-w-none">
//               <h3 className="text-xl font-semibold mb-3">User Agreement</h3>
//               <p className="mb-4 text-gray-600">
//                 By accessing and using BANK ERP, you agree to comply with all applicable banking regulations and data protection laws. 
//                 All transactions are subject to audit and may be reported to regulatory authorities as required by law.
//               </p>
              
//               <h3 className="text-xl font-semibold mb-3">Data Privacy</h3>
//               <p className="mb-4 text-gray-600">
//                 We adhere to strict data privacy standards including GDPR and CCPA. All personal and financial data is encrypted 
//                 both in transit and at rest. Access to sensitive information is logged and monitored.
//               </p>
              
//               <h3 className="text-xl font-semibold mb-3">Service Availability</h3>
//               <p className="mb-4 text-gray-600">
//                 BANK ERP guarantees 99.9% uptime excluding scheduled maintenance windows. We perform regular backups and have 
//                 disaster recovery procedures in place to ensure business continuity.
//               </p>
              
//               <h3 className="text-xl font-semibold mb-3">User Responsibilities</h3>
//               <p className="text-gray-600">
//                 Users must maintain the confidentiality of their login credentials and immediately report any suspicious activity. 
//                 The system should only be used for legitimate banking operations in compliance with all applicable laws.
//               </p>
//             </div>
//           </div>

//           {/* User Relations Section */}
//           <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6">User Relations</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <h3 className="text-xl font-semibold mb-3">Customer Support</h3>
//                 <p className="text-gray-600 mb-4">
//                   Our dedicated support team is available 24/7 to assist with any issues or questions. 
//                   Contact us via phone, email, or live chat for immediate assistance.
//                 </p>
//                 <Button className="bg-blue-600 hover:bg-blue-700">Contact Support</Button>
//               </div>
              
//               <div>
//                 <h3 className="text-xl font-semibold mb-3">Training & Resources</h3>
//                 <p className="text-gray-600 mb-4">
//                   We provide comprehensive training materials, video tutorials, and documentation to help 
//                   users maximize their productivity with BANK ERP.
//                 </p>
//                 <div className="flex space-x-3">
//                   <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Documentation</Button>
//                   <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Training Videos</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BankERPDashboard;


// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import NavBar from "@/components/ui/NavBar";
// import Link from "next/link";
// import axios from "axios";

// const Dashboard = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [account,setAccount] =useState(null);

//   useEffect(() => {
//     const fetchAccountDetails = async () => {
//   try {
//     const response = await axios.get(
//       "http://localhost:5000/api/user/123e4567-e89b-12d3-a456-426614174001"
//     );
    
//     console.log("Account API Response:", response.data);
    
//     if (response.data?.accounts?.length > 0) {
//       setAccount({
//         account_no: response.data.accounts[0].account_no || "N/A",
//         balance: response.data.accounts[0].balance || 0
//       });
//     } else {
//       console.error("No accounts found in response");
//       setAccount({
//         account_no: "No Account",
//         balance: 0
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching account details:", error);
//     setAccount({
//       account_no: "Error Loading",
//       balance: 0
//     });
//   }
// };
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/user/123e4567-e89b-12d3-a456-426614174001"
//         );
        
//         // console.log("Full API response:", response); 
        
//         if (response.data && response.data.name && response.data.email) {
//           setUser({
//             name: response.data.name,
//             email: response.data.email,
//           });
//         } else {
//           console.error("Unexpected API response structure:", response.data);
//           setUser({  // Fallback data
//             name: "Error Loading Name", 
//             email: "Error Loading Email"
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//         setUser({  // Fallback data
//           name: "Error Loading Name", 
//           email: "Error Loading Email"
//         });
//       }
//     };

//     const fetchTransactions = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/transactions");
//         setTransactions(response.data);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAccountDetails();
//     fetchUserDetails();
//     fetchTransactions();
//   }, []);

//   return (
//     <div>
//       <NavBar />
//       <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
//         <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
//         {user ? (
//           <div className="bg-black p-4 rounded-lg shadow mb-6">
//             <h2 className="text-xl font-semibold">Account Overview</h2>
//             <p><strong>Name:</strong> {user.name}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//             <p><strong>Account:</strong> {account ? account.account_no : "Loading..."}</p>
//             <p><strong>Balance:</strong> {account ? `$${account.balance}` : "Loading..."}</p>
//             </div>
//         ) : (
//           <p>Loading user details...</p>
//         )}     


//         {/* Rest of your existing JSX */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <Link href="/user/transaction">
//             <Button className="bg-purple-600 hover:bg-purple-700 w-full">View Transactions</Button>
//           </Link>
//           <Link href="/user/account">
//             <Button className="bg-gray-600 hover:bg-gray-700 w-full">View Statements</Button>
//           </Link>
//         </div>

//         <h2 className="text-2xl font-semibold mt-6">Recent Transactions</h2>
//         {loading ? (
//           <p>Loading transactions...</p>
//         ) : (
//           <div className="bg-[#383838] p-4 rounded-lg mt-2 shadow">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr>
//                   <th className="text-left p-2">Date</th>
//                   <th className="text-left p-2">Type</th>
//                   <th className="text-left p-2">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map((tx) => (
//                   <tr key={tx.trans_id} className="border-b border-gray-700">
//                     <td className="p-2">{new Date(tx.transac_time).toLocaleString()}</td>
//                     <td className="p-2">
//                       <span className={tx.type === "Deposit" ? "text-green-400" : "text-red-400"}>{tx.type}</span>
//                     </td>
//                     <td className="p-2">${tx.amount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="bg-black p-4 rounded-lg shadow">
//           <h3 className="text-xl font-semibold">Terms and Conditions</h3>
//           <p className="mt-2 text-sm text-gray-400">By using this dashboard, you agree to our terms and conditions. Please read them carefully.</p>
//           <Link href="/terms">
//             <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4">View Full Terms and Conditions</Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// "use client"; // Required for client-side navigation
// import React from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import NavBar from "@/components/ui/NavBar";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import axios from "axios";


// const dashboard = () => {
//    const [transactions, setTransactions] = useState([]);
//    const [loading, setLoading] = useState(true);
//     const [amount, setAmount] = useState("");
//     const [accountNo, setAccountNo] = useState("");
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [transactionType, setTransactionType] = useState("");
  
//     useEffect(() => {
//       const fetchTransactions = async () => {
//         try {
//           const response = await axios.get("http://localhost:5000/api/transactions");
//           setTransactions(response.data);
//           console.log(data);
//         } catch (error) {
//           console.log(error);
//           // console.error("Error fetching transactions:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchTransactions();
//     }, []);
  
//     const handleTransaction = async (type) => {
//       const formattedTime = new Date().toLocaleString();
//       if (!amount || isNaN(amount) || amount <= 0) {
//         alert("Please enter a valid amount");
//         return;
//       }
  
//       const newTransaction = {
//         transac_time: formattedTime,
//         account_no: accountNo,
//         first_name: firstName,
//         last_name: lastName,
//         type,
//         amount,
//       };
  
//       try {
//         const response = await axios.post("http://localhost:5000/api/transactions", newTransaction);
//         setTransactions([response.data, ...transactions]);
//         resetForm();
//       } catch (error) {
//         console.error("Error adding transaction:", error);
//       }
//     };
  
//     const resetForm = () => {
//       setAmount("");
//       setAccountNo("");
//       setFirstName("");
//       setLastName("");
//       setTransactionType("");
//     };

//     const user=
//     {
//       name:"pranathi",
//       email:"praan@example.com",
//       balance:"5400000",
//       accountNumber:"1004"
//     }

//   return (
//     <div>
//       <NavBar />
//       <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
//         {/* Account Overview Section */}
//         <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
//         <div className="bg-black p-4 rounded-lg shadow mb-6">
//           <h2 className="text-xl font-semibold">Account Overview</h2>
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Account Number:</strong> {user.accountNumber}</p>
//           <p><strong>Balance:</strong> <span className="text-green-400 font-semibold">{user.balance}</span></p>
         
//         </div>

//         {/* Quick Actions Section */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           {/* <Link href="/transfer">
//             <Button className="bg-blue-600 hover:bg-blue-700 w-full">Transfer Funds</Button>
//           </Link> */}
//           <Link href="/transactions">
//             <Button className="bg-purple-600 hover:bg-purple-700 w-full">View Transactions</Button>
//           </Link>
//           <Link href="/statements">
//             <Button className="bg-gray-600 hover:bg-gray-700 w-full">View Statements</Button>
//           </Link>
//         </div>

//         {/* Recent Transactions Section */}
//         <h2 className="text-2xl font-semibold mt-6">Recent Transactions</h2>
//             <div className="bg-[#383838] p-4 rounded-lg mt-2 shadow">
//               <table className="min-w-full table-auto">
//                 <thead>
//                   <tr>
//                     <th className="text-left p-2">Date</th>
//                     <th className="text-left p-2">Type</th>
//                     <th className="text-left p-2">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactions.map((tx) => (
//                     <tr key={tx.trans_id} className="border-b border-gray-700">
//                       <td className="p-2">{new Date(tx.transac_time).toLocaleString()}</td>
//                       <td className="p-2">
//                         <span className={tx.type === "Deposit" ? "text-green-400" : "text-red-400"}>
//                           {tx.type}
//                         </span>
//                       </td>
//                       <td className="p-2">${tx.amount}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//         {/* Terms and Conditions Link */}
//         <div className="bg-black p-4 rounded-lg shadow">
//           <h3 className="text-xl font-semibold">Terms and Conditions</h3>
//           <p className="mt-2 text-sm text-gray-400">
//             By using this dashboard, you agree to our terms and conditions. Please read them carefully.
//           </p>
//           <Link href="/terms">
//             <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4">View Full Terms and Conditions</Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default dashboard;
