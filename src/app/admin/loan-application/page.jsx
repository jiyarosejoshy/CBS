
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/ui/Navbar-admin";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Card, CardContent } from "@mui/material";

const LoansPage = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/loans")
      .then((response) => setLoans(response.data))
      .catch((error) => console.error("Error fetching loans:", error));
  }, []);

  return (
    <div flex-col justify-center items-center gap-10 h-screen left-5>
      <NavBar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px" ,leftmargin:"10px"}}>
      <div className="text-4xl font-semibold px-[325px]">Loan Informations</div>
       
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loan ID</TableCell>
                  <TableCell>Loan Type</TableCell>
                  <TableCell>Loan Amount</TableCell>
                  <TableCell>Interest Rate</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Collateral Type</TableCell>
                  <TableCell>Collateral Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.loan_id}</TableCell>
                    <TableCell>{loan.loan_type}</TableCell>
                    <TableCell>{`$${loan.loan_amount.toLocaleString()}`}</TableCell>
                    <TableCell>{loan.interest_rate}%</TableCell>
                    <TableCell>{loan.start_date}</TableCell>
                    <TableCell>{loan.end_date}</TableCell>
                    <TableCell>{loan.status}</TableCell>
                    <TableCell>{loan.collateral_type}</TableCell>
                    <TableCell>{loan.collateral_value ? `$${loan.collateral_value.toLocaleString()}` : "None"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoansPage;