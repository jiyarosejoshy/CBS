"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

const LoanPage = () => {
  const [loanData, setLoanData] = useState({
    amount: "",
    purpose: "",
    duration: "12",
  });
  const [collateral, setCollateral] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingLoans, setExistingLoans] = useState([]);
  const [loansError, setLoansError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/loans/user/987f6543-e21b-11d3-a234-426614174002"
        );
        setExistingLoans(response.data);
      } catch (error) {
        console.error("Failed to fetch loans:", error);
        setLoansError("Failed to load loan history");
      }
    };

    fetchLoans();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoanData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCollateral(file);
      toast.success("PDF uploaded successfully");
    } else {
      toast.error("Please upload a PDF file only");
    }
  };

  const submitLoanApplication = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Processing your loan application...");
    
    try {
      const formData = new FormData();
      formData.append('amount', loanData.amount);
      formData.append('purpose', loanData.purpose);
      formData.append('duration', loanData.duration);
      formData.append('collateral', collateral);

      const response = await axios.post(
        'http://localhost:5000/api/loans/user/987f6543-e21b-11d3-a234-426614174002', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success("Loan application submitted!", {
        id: toastId,
        description: "Your application is under review",
      });

      // Reset form
      setLoanData({ amount: "", purpose: "", duration: "12" });
      setCollateral(null);

    } catch (error) {
      toast.error("Application failed", {
        id: toastId,
        description: error.response?.data?.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Loan Application Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Apply for Loan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={loanData.amount}
                onChange={handleInputChange}
                min="1000"
                max="50000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (months)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={loanData.duration}
                onChange={handleInputChange}
                min="6"
                max="60"
                required
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                name="purpose"
                value={loanData.purpose}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="collateral">Collateral (PDF)</Label>
              <Input
                id="collateral"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                required
              />
            </div>
          </div>
        </CardContent>
          <Button 
            onClick={submitLoanApplication}
            disabled={isLoading || !loanData.amount || !collateral}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Submit Application"}
          </Button>
      </Card>

      {/* Existing Loans Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {existingLoans.length > 0 ? (
            existingLoans.map(loan => (
              <div key={loan.loan_id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{loan.loan_type} Loan</h3>
                    <p className="text-sm text-muted-foreground">ID: {loan.loan_id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    loan.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {loan.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p>${loan.loan_amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p>{loan.interest_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Collateral</p>
                    <p>{loan.collateral_type}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No active loans found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanPage;