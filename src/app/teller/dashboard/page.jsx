"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/Navbar-teller";
import { Label } from "@/components/ui/label";
import { Clock, BookOpen, Upload, Bookmark, Bell, User, Lock, Unlock, Wallet } from "lucide-react";

const TellerDashboard = () => {
  const [cashBalance, setCashBalance] = useState(50000);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // This will only run on client side
    setCurrentTime(new Date().toLocaleTimeString());
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const toggleBankStatus = () => {
    setIsBankOpen(!isBankOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Teller Operations Hero Section */}
        <Card className="bg-blue-50 border border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-700 rounded-lg">
                    <Wallet className="h-8 w-8" />
                  </div>
                  <div>
                   <CardTitle className="text-3xl font-bold text-blue-800">
                      Welcome to Teller Operations
                    </CardTitle>
                    <CardDescription className="text-blue-800  mt-1">
                      Your gateway to seamless banking services
                    </CardDescription>
                  </div>
                </div>
                
                <CardContent className="px-0">
                  <div className="space-y-4">
                    <p className="text-blue-700 leading-relaxed">
                      As a valued teller of our cooperative bank, you play a pivotal role in delivering 
                      exceptional service to our members while maintaining the highest standards of 
                      financial accuracy and security.
                    </p>
                    {currentTime && (
                      <div className="flex items-center gap-2 text-blue-800">
                        <Clock className="h-5 w-5" />
                        <span>Last login: Today at {currentTime}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-700/50 px-3 py-1 rounded-full">
                  <User className="h-8 w-8 rounded-full bg-blue-500 p-1" />
                  <div>
                    <span className="font-medium">Teller 001</span>
                    <span className="block text-xs text-blue-300">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-2xl shadow-md text-center">
                <div className="text-sm tracking-wide text-blue-100 mb-1">Cash Balance</div>
                <div className="text-3xl font-extrabold">₹{cashBalance.toLocaleString()}</div>
              </div>

              <Button
                onClick={toggleBankStatus}
                className={`h-[85px] px-6 flex items-center justify-center gap-3 rounded-2xl font-semibold text-base transition-all duration-200 shadow-sm ${
                  isBankOpen
                    ? 'bg-red-100 text-red-800 border border-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-800 border border-green-900 hover:bg-green-200'
                }`}
              >
                {isBankOpen ? (
                  <>
                    <Lock className="h-5 w-5" />
                    Close Bank
                  </>
                ) : (
                  <>
                    <Unlock className="h-5 w-5" />
                    Open Bank
                  </>
                )}
              </Button>

              </div>
            </div>
          </CardContent>
        </Card>
         {/* Teller Responsibilities Showcase */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-800" />
                <CardTitle className="text-blue-800">Opening/Closing Logs</CardTitle>
              </div>
              <CardDescription className="text-blue-600">
                Record and verify daily bank operations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Upload className="h-6 w-6 text-green-800" />
                <CardTitle className="text-green-800">Offline Transactions</CardTitle>
              </div>
              <CardDescription className="text-green-600">
                Process transactions when systems are down
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-800" />
                <CardTitle className="text-purple-800">Transaction Verification</CardTitle>
              </div>
              <CardDescription className="text-purple-600">
                Ensure all transactions are accurately recorded
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-teal-200 bg-teal-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bookmark className="h-6 w-6 text-teal-800" />
                <CardTitle className="text-teal-800">Daily Reconciliation</CardTitle>
              </div>
              <CardDescription className="text-teal-600">
                Balance cash and electronic transactions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Bank Status Card */}
        <Card className="w-full max-w-7xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              {isBankOpen ? (
                <Unlock className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-red-600" />
              )}
              <CardTitle>
                Bank is currently {isBankOpen ? "OPEN" : "CLOSED"}
              </CardTitle>
            </div>
            <CardDescription>
              {isBankOpen 
                ? "Remember to complete closing procedures at end of day"
                : "Open the bank to begin daily operations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Today's Date</Label>
                <span className="font-medium">{currentDate || "Loading..."}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label>Current Time</Label>
                <span className="font-medium">{currentTime || "Loading..."}</span>
              </div>
              <Button 
                onClick={toggleBankStatus}
                className={`w-full mt-2 ${isBankOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isBankOpen ? 'Begin Closing Procedures' : 'Open Bank for Business'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TellerDashboard;
