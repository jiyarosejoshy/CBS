"use client"; // Required for client-side navigation
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/NavBar";
import Link from "next/link";

const dashboard = () => {
  const user = {
    name: "Jane Doe",
    email: "jane@meowmeow.com",
    accountNumber: "xxxxxx1485",
    balance: "12,345.67",
    availableBalance: "10,000.00",
    transactions: [
      { id: 1, type: "Deposit", amount: "15000", date: "2025-03-10" },
      { id: 2, type: "Withdrawal", amount: "2000", date: "2025-03-09" },
    ],
  };

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
          <p><strong>Available Balance:</strong> <span className="text-yellow-400 font-semibold">{user.availableBalance}</span></p>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/transfer">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full">Transfer Funds</Button>
          </Link>
          <Link href="/pay-bills">
            <Button className="bg-green-600 hover:bg-green-700 w-full">Pay Bills</Button>
          </Link>
          <Link href="/transactions">
            <Button className="bg-purple-600 hover:bg-purple-700 w-full">View Transactions</Button>
          </Link>
          <Link href="/statements">
            <Button className="bg-gray-600 hover:bg-gray-700 w-full">View Statements</Button>
          </Link>
        </div>

        {/* Recent Transactions Section */}
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <div className="bg-[#333333] p-4 rounded-lg shadow mb-6">
          {user.transactions.map((tx) => (
            <div key={tx.id} className="flex justify-between border-b border-gray-700 py-2">
              <span>{tx.date}</span>
              <span className={tx.type === "Deposit" ? "text-green-400" : "text-red-400"}>
                {tx.type}: {tx.amount}
              </span>
            </div>
          ))}
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
