// "use client";  // Required for client-side navigation
// import React from "react";
// import { useRouter } from "next/navigation";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import NavBar from "@/components/ui/NavBar";
// import Link from "next/link";


// const transaction = () => {
//   const user = {
//     name: "Jane Doe",
//     email: "jane@example.com",
//     accountNumber: "1234567890",
//     balance: "$12,345.67",
//     transactions: [
//       { id: 1, type: "Deposit", amount: "15000", date: "2025-03-10" },
//       { id: 2, type: "Withdrawal", amount: "2000", date: "2025-03-09" },
//     ],
//   };

//   return (
//     <div>
//       <NavBar />
//       <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
//         <h1 className="text-3xl font-bold mb-4">Transaction</h1>
//         <h2 className="text-2xl font-semibold mt-6">Recent Transactions</h2>
//         <div className="bg-[#383838] p-4 rounded-lg mt-2 shadow">
//           {user.transactions.map((tx) => (
//             <div key={tx.id} className="flex justify-between border-b border-gray-700 py-2">
//               <span>{tx.date}</span>
//               <span className={tx.type === "Deposit" ? "text-green-400" : "text-red-400"}>
//                 {tx.type}: {tx.amount}
//               </span>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6">
//           <h2 className="text-2xl font-semibold">New Transactions</h2>

//           <div className="mt-4">
//             <p className="text-gray-400">Transfer Amount</p>
//           </div>

//           <div className="flex items-center gap-4 mt-2">
//             <Input className="bg-gray-800 border-gray-600 text-white flex-1" placeholder="Enter amount" />
//             <Button variant="default">Deposit</Button>
//             <Button variant="destructive">Withdraw</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default transaction;


// "use client";  // Required for client-side navigation
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import NavBar from "@/components/ui/NavBar";
// import { useRouter } from "next/navigation";

// const Transaction = () => {
//   const [transactions, setTransactions] = useState([]); // State to hold transactions
//   const [loading, setLoading] = useState(true); // Loading state for fetching data
//   const [amount, setAmount] = useState(""); // State to hold amount for new transactions
//   const [accountNo, setAccountNo] = useState(""); // Account number for the new transaction
//   const [firstName, setFirstName] = useState(""); // First name for the new transaction
//   const [lastName, setLastName] = useState(""); // Last name for the new transaction
//   const [balance, setBalance] = useState(""); // Balance for the new transaction
//   const [transactionType, setTransactionType] = useState(""); // Transaction type (Deposit/Withdrawal)

//   // Fetch all transactions when the component mounts
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/transactions'); // Fetch transactions from the API
//         const data = await response.json();
//         setTransactions(data); // Store fetched transactions in state
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       } finally {
//         setLoading(false); // Stop loading after fetching data
//       }
//     };
//     fetchTransactions();
//   }, []);

//   // Handle new transaction (Deposit/Withdraw)
//   const handleTransaction = async (type) => {
//     const formattedTime = new Date().toLocaleString();
//     if (!amount || isNaN(amount) || amount <= 0) {
//       alert("Please enter a valid amount");
//       return;
//     }

//     const newTransaction = {

//       // transac_time:formattedTime,
//       account_no: accountNo, 
//       first_name: firstName, 
//       last_name: lastName, 
//       type, 
//       amount
    
//     };
  
//     console.log("Sending transaction data:", newTransaction);  // Log the transaction data
  
//     try {
//       const response = await fetch('https://localhost:5000/api/transactions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newTransaction),
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to create transaction");
//       }
  
//       const data = await response.json();
//       setTransactions([data, ...transactions]); // Add the new transaction to the front of the list
//       resetForm();
  
//     } catch (error) {
//       console.error("Error adding transaction:", error);
//     }
//   };
  

//   // Reset form fields after transaction
//   const resetForm = () => {
//     setAmount("");
//     setAccountNo("");
//     setFirstName("");
//     setLastName("");
//     setBalance("");
//     setTransactionType("");
//   };

//   // Loading state
//   if (loading) return <div>Loading transactions...</div>;

//   return (
//     <div>
//       <NavBar />
//       <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
//         <h1 className="text-3xl font-bold mb-4">Transaction</h1>

//         {/* Transaction List */}
//         <h2 className="text-2xl font-semibold mt-6">Recent Transactions</h2>
//         <div className="bg-[#383838] p-4 rounded-lg mt-2 shadow">
//           {transactions.length > 0 ? (
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr>
//                   <th className="text-left p-2">Date</th>
//                   <th className="text-left p-2">Type</th>
//                   <th className="text-left p-2">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map((tx) => {
//                   const formattedTime = new Date(tx.transac_time).toLocaleString();
//                   return (
//                     <tr key={tx.trans_id} className="border-b border-gray-700">
//                       <td className="p-2">{formattedTime}</td>
//                       <td className="p-2">
//                         <span className={tx["credit/debit"] === "Deposit" ? "text-green-400" : "text-red-400"}>
//                           {tx["credit/debit"]}
//                         </span>
//                       </td>
//                       <td className="p-2">${tx.balance}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           ) : (
//             <div>No transactions available.</div>
//           )}
//         </div>

//         {/* New Transaction Form */}
//         <div className="mt-6">
//           <h2 className="text-2xl font-semibold">New Transaction</h2>

//           <div className="mt-4">
//             <p className="text-gray-400">Enter Amount</p>
//             <Input
//               className="bg-gray-800 border-gray-600 text-white flex-1"
//               placeholder="Enter amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//           </div>

//           {/* Account and User Info */}
//           <div className="mt-4">
//             <Input
//               className="bg-gray-800 border-gray-600 text-white flex-1"
//               placeholder="Account Number"
//               value={accountNo}
//               onChange={(e) => setAccountNo(e.target.value)}
//             />
//           </div>
//           <div className="mt-4">
//             <Input
//               className="bg-gray-800 border-gray-600 text-white flex-1"
//               placeholder="First Name"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//             />
//           </div>
//           <div className="mt-4">
//             <Input
//               className="bg-gray-800 border-gray-600 text-white flex-1"
//               placeholder="Last Name"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//             />
//           </div>
          

//           {/* Buttons for Deposit and Withdrawal */}
//           <div className="flex items-center gap-4 mt-4">
//             <Button variant="default" onClick={() => handleTransaction("Deposit")}>
//               Deposit
//             </Button>
//             <Button variant="destructive" onClick={() => handleTransaction("Withdrawal")}>
//               Withdraw
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Transaction;   

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/ui/NavBar";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [transactionType, setTransactionType] = useState("");

  useEffect(() => {
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
    fetchTransactions();
  }, []);

  const handleTransaction = async (type) => {
    const formattedTime = new Date().toLocaleString();
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const newTransaction = {
      transac_time: formattedTime,
      account_no: accountNo,
      first_name: firstName,
      last_name: lastName,
      type,
      amount,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/transactions", newTransaction);
      setTransactions([response.data, ...transactions]);
      resetForm();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const resetForm = () => {
    setAmount("");
    setAccountNo("");
    setFirstName("");
    setLastName("");
    setTransactionType("");
  };

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold mb-4">Transaction</h1>

        {transactions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mt-6">Recent Transactions</h2>
            <div className="bg-[#383838] p-4 rounded-lg mt-2 shadow">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.trans_id} className="border-b border-gray-700">
                      <td className="p-2">{new Date(tx.transac_time).toLocaleString()}</td>
                      <td className="p-2">
                        <span className={tx.type === "Deposit" ? "text-green-400" : "text-red-400"}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-2">${tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">New Transaction</h2>

          <Input className="bg-gray-800 border-gray-600 text-white flex-1 mt-4" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input className="bg-gray-800 border-gray-600 text-white flex-1 mt-4" placeholder="Account Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
          <Input className="bg-gray-800 border-gray-600 text-white flex-1 mt-4" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input className="bg-gray-800 border-gray-600 text-white flex-1 mt-4" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          
          <div className="flex items-center gap-4 mt-4">
            <Button variant="default" onClick={() => handleTransaction("Deposit")}>
              Deposit
            </Button>
            <Button variant="destructive" onClick={() => handleTransaction("Withdrawal")}>
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
  