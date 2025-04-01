"use client";  // Required for client-side navigation
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/NavBar";
import Link from "next/link";


const transaction = () => {
  const user = {
    name: "Jane Doe",
    email: "jane@example.com",
    accountNumber: "1234567890",
    balance: "$12,345.67",
    transactions: [
      { id: 1, type: "Deposit", amount: "15000", date: "2025-03-10" },
      { id: 2, type: "Withdrawal", amount: "2000", date: "2025-03-09" },
    ],
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold mb-4">Transaction</h1>
        <h2 className="text-2xl font-semibold mt-6">Recent Transactions</h2>
        <div className="bg-[#383838] p-4 rounded-lg mt-2 shadow">
          {user.transactions.map((tx) => (
            <div key={tx.id} className="flex justify-between border-b border-gray-700 py-2">
              <span>{tx.date}</span>
              <span className={tx.type === "Deposit" ? "text-green-400" : "text-red-400"}>
                {tx.type}: {tx.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">New Transactions</h2>

          <div className="mt-4">
            <p className="text-gray-400">Transfer Amount</p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <Input className="bg-gray-800 border-gray-600 text-white flex-1" placeholder="Enter amount" />
            <Button variant="default">Deposit</Button>
            <Button variant="destructive">Withdraw</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default transaction;
