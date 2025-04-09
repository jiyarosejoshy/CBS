"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/NavBar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";

const AccountPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);

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
        
        if (response.data && response.data.name && response.data.email) {
          setUser({
            name: response.data.name,
            email: response.data.email,
          });
        } else {
          setUser({
            name: "Error Loading Name", 
            email: "Error Loading Email"
          });
        }
      } catch (error) {
        setUser({
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Account Overview Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Account Overview</CardTitle>
            <CardDescription>Your personal banking details</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Full Name</Label>
                    <p className="text-lg font-medium mt-1">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Email Address</Label>
                    <p className="text-lg font-medium mt-1">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Account Number</Label>
                    <p className="text-lg font-medium mt-1">
                      {account ? account.account_no : (
                        <span className="animate-pulse">Loading...</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Current Balance</Label>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {account ? `${account.balance.toLocaleString()}` : (
                        <span className="animate-pulse">Loading...</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">Loading user details...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Recent Transactions</CardTitle>
            <CardDescription>Your account activity</CardDescription>
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
                        {tx.amount.toLocaleString()}
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
    </div>
  );
};

export default AccountPage;