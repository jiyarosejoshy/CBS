"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import NavBar from "@/components/ui/Navbar-admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ApproveRejectLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/loans/pending");
        setLoans(response.data);
      } catch (err) {
        setError("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();

    // Subscribe to real-time changes
    const loanChannel = supabase
      .channel("loans-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "loans" },
        (payload) => {
          if (payload.new.status === "approved" || payload.new.status === "rejected") {
            setLoans((prevLoans) =>
              prevLoans.filter((loan) => loan.loan_id !== payload.new.loan_id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(loanChannel);
    };
  }, []);

  const updateLoanStatus = async (loan_id, action) => {
    try {
      await axios.patch(`http://localhost:5000/admin/loans/${loan_id}/${action}`);
      setLoans((prevLoans) => prevLoans.filter((loan) => loan.loan_id !== loan_id));
    } catch (err) {
      setError(`Failed to update loan status to ${action}`);
    }
  };

  if (loading) return <p className="p-4 text-center">Loading loans...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto p-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Loan Approval Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {loans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Collateral</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.loan_id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">#{loan.loan_id}</div>
                        <div className="text-sm text-gray-500">{loan.loan_type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">₹{loan.loan_amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{loan.interest_rate}%</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Start: {new Date(loan.start_date).toLocaleDateString()}</div>
                          <div>End: {new Date(loan.end_date).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {loan.collateral_type ? (
                          <div className="text-sm">
                            <div>{loan.collateral_type}</div>
                            <div>₹{loan.collateral_value?.toLocaleString() || "N/A"}</div>
                          </div>
                        ) : (
                          <Badge variant="outline">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={loan.status === "pending" ? "secondary" : "default"}>
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => updateLoanStatus(loan.loan_id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateLoanStatus(loan.loan_id, "reject")}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-gray-400 mb-4">No pending loans available</div>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApproveRejectLoans;
