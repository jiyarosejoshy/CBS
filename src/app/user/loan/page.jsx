"use client";  // Required for client-side navigation

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/NavBar";

const Loan = () => {
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    loan_id: "",
    loan_type: "personal",
    loan_amount: "",
    interest_rate: "5.5",
    start_date: "",
    end_date: "",
    status: "pending",
    collateral_type: "Property",
    collateral_value: "None",
  });
  const router = useRouter();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/loans");
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  const handleCreateLoan = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/loans", newLoan);
      setLoans([...loans, response.data]);
      setNewLoan({
        loan_id: "",
        loan_type: "personal",
        loan_amount: "",
        interest_rate: "5.5",
        start_date: "",
        end_date: "",
        status: "pending",
        collateral_type: "Property",
        collateral_value: "None",
      });
    } catch (error) {
      console.error("Error creating loan:", error);
    }
  };

  const handleDeleteLoan = async (loan_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/loans/${loan_id}`);
      setLoans(loans.filter((loan) => loan.loan_id !== loan_id));
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold mb-4">Loan Applications</h1>

        {/* Loan Application Form */}
        <div className="bg-[#333] p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Apply for a Loan</h2>
          <Input
            placeholder="Loan ID"
            value={newLoan.loan_id}
            onChange={(e) => setNewLoan({ ...newLoan, loan_id: e.target.value })}
          />
          <Input
            placeholder="Loan Amount"
            value={newLoan.loan_amount}
            onChange={(e) => setNewLoan({ ...newLoan, loan_amount: e.target.value })}
          />
          <Input
            placeholder="Start Date (YYYY-MM-DD)"
            value={newLoan.start_date}
            onChange={(e) => setNewLoan({ ...newLoan, start_date: e.target.value })}
          />
          <Input
            placeholder="End Date (YYYY-MM-DD)"
            value={newLoan.end_date}
            onChange={(e) => setNewLoan({ ...newLoan, end_date: e.target.value })}
          />
          <Button className="bg-green-600 mt-4" onClick={handleCreateLoan}>
            Submit Loan Application
          </Button>
        </div>

        {/* Loan List */}
        <h2 className="text-2xl font-semibold mt-6">Existing Loans</h2>
        <div className="bg-[#444] p-4 rounded-lg mt-2 shadow">
          {loans.map((loan) => (
            <div key={loan.loan_id} className="flex justify-between border-b border-gray-700 py-2">
              <span>{loan.loan_id} - {loan.status}</span>
              <Button className="bg-red-600" onClick={() => handleDeleteLoan(loan.loan_id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loan;
