"use client";  // Required for client-side navigation
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/NavBar";
import Link from "next/link";


const account = () => {
  const user = {
    name: "Jane Doe",
    email: "jane@meowmeow.com",
    accountNumber: "xxxxxx1485",
    balance: "12,345.67",
    transactions: [
      { id: 1, type: "Deposit", amount: "15000", date: "2025-03-10" },
      { id: 2, type: "Withdrawal", amount: "2000", date: "2025-03-09" },
    ],
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold mb-4">Account Details</h1>
        <div className="bg-black p-4 rounded-lg shadow">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account Number:</strong> {user.accountNumber}</p>
          <p><strong>Balance:</strong> <span className="text-green-400 font-semibold">{user.balance}</span></p>
        </div>

        <h2 className="text-2xl font-semibold mt-6">Recent Transactions</h2>
        <div className="bg-[#333333] p-4 rounded-lg mt-2 shadow">
          {user.transactions.map((tx) => (
            <div key={tx.id} className="flex justify-between border-b border-gray-700 py-2">
              <span>{tx.date}</span>
              <span className={tx.type === "Deposit" ? "text-green-400" : "text-red-400"}>
                {tx.type}: {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default account;
