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
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-100"
                    onClick={() => router.push("/user/transaction")}
                  >
                    Make a Transfer
                  </Button>
  
                  <Button 
                    variant="outline" 
                    className="border-green-600 text-green-600 hover:bg-green-100"
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
