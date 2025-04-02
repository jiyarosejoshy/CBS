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
