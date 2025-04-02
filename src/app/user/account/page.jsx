"use client";  // Required for client-side navigation
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/NavBar";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";

const account = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [account,setAccount] =useState(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/user/123e4567-e89b-12d3-a456-426614174001"
    );
    
    console.log("Account API Response:", response.data);
    
    if (response.data?.accounts?.length > 0) {
      setAccount({
        account_no: response.data.accounts[0].account_no || "N/A",
        balance: response.data.accounts[0].balance || 0
      });
    } else {
      console.error("No accounts found in response");
      setAccount({
        account_no: "No Account",
        balance: 0
      });
    }
  } catch (error) {
    console.error("Error fetching account details:", error);
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
        
        // console.log("Full API response:", response); 
        
        if (response.data && response.data.name && response.data.email) {
          setUser({
            name: response.data.name,
            email: response.data.email,
          });
        } else {
          console.error("Unexpected API response structure:", response.data);
          setUser({  // Fallback data
            name: "Error Loading Name", 
            email: "Error Loading Email"
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser({  // Fallback data
          name: "Error Loading Name", 
          email: "Error Loading Email"
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
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold mb-4">Account Details</h1>
        {user ? (
          <div className="bg-black p-4 rounded-lg shadow mb-6">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Account:</strong> {account ? account.account_no : "Loading..."}</p>
            <p><strong>Balance:</strong> {account ? `$${account.balance}` : "Loading..."}</p>
            </div>
        ) : (
          <p>Loading user details...</p>
        )}     

<h2 className="text-2xl font-semibold mt-6">Recent Transactions</h2>
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
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
                      <span className={tx.type === "Deposit" ? "text-green-400" : "text-red-400"}>{tx.type}</span>
                    </td>
                    <td className="p-2">${tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default account;
