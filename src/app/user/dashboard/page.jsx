"use client"; // Required for client-side navigation
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/NavBar";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";


const dashboard = () => {
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
          console.log(data);
        } catch (error) {
          console.log(error);
          // console.error("Error fetching transactions:", error);
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

    const user=
    {
      name:"pranathi",
      email:"praan@example.com",
      balance:"5400000",
      accountNumber:"1004"
    }

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
        {/* Account Overview Section */}
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="bg-black p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold">Account Overview</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account Number:</strong> {user.accountNumber}</p>
          <p><strong>Balance:</strong> <span className="text-green-400 font-semibold">{user.balance}</span></p>
         
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* <Link href="/transfer">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full">Transfer Funds</Button>
          </Link> */}
          <Link href="/transactions">
            <Button className="bg-purple-600 hover:bg-purple-700 w-full">View Transactions</Button>
          </Link>
          <Link href="/statements">
            <Button className="bg-gray-600 hover:bg-gray-700 w-full">View Statements</Button>
          </Link>
        </div>

        {/* Recent Transactions Section */}
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

        {/* Terms and Conditions Link */}
        <div className="bg-black p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Terms and Conditions</h3>
          <p className="mt-2 text-sm text-gray-400">
            By using this dashboard, you agree to our terms and conditions. Please read them carefully.
          </p>
          <Link href="/terms">
            <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4">View Full Terms and Conditions</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default dashboard;
