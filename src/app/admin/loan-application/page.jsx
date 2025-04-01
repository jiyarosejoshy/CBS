"use client";  // Required for client-side navigation
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Card, CardContent } from "@mui/material";

// Dummy loan data
const loanData = [
  {
    "loan_id": "loan_10001",
    "user_id": "user_2001",
    "loan_type": "home",
    "loan_amount": 350000.00,
    "loan_term": 20,
    "interest_rate": 4.5,
    "start_date": "2024-05-01",
    "end_date": "2044-05-01",
    "monthly_payment": 2200.00,
    "total_repayment": 528000.00,
    "loan_status": "approved",
    "collateral": {
      "type": "real estate",
      "value": 400000.00
    }
  },
  {
    "loan_id": "loan_10002",
    "user_id": "user_2002",
    "loan_type": "auto",
    "loan_amount": 25000.00,
    "loan_term": 5,
    "interest_rate": 7.0,
    "start_date": "2025-01-15",
    "end_date": "2030-01-15",
    "monthly_payment": 500.00,
    "total_repayment": 30000.00,
    "loan_status": "disbursed",
    "collateral": {
      "type": "vehicle",
      "value": 30000.00
    }
  },
  {
    "loan_id": "loan_10003",
    "user_id": "user_2003",
    "loan_type": "personal",
    "loan_amount": 15000.00,
    "loan_term": 3,
    "interest_rate": 9.5,
    "start_date": "2023-06-10",
    "end_date": "2026-06-10",
    "monthly_payment": 500.00,
    "total_repayment": 18000.00,
    "loan_status": "pending",
    "collateral": null
  },
  {
    "loan_id": "loan_10004",
    "user_id": "user_2004",
    "loan_type": "education",
    "loan_amount": 50000.00,
    "loan_term": 10,
    "interest_rate": 6.0,
    "start_date": "2024-09-01",
    "end_date": "2034-09-01",
    "monthly_payment": 500.00,
    "total_repayment": 60000.00,
    "loan_status": "approved",
    "collateral": null
  },
  {
    "loan_id": "loan_10005",
    "user_id": "user_2005",
    "loan_type": "business",
    "loan_amount": 100000.00,
    "loan_term": 7,
    "interest_rate": 8.0,
    "start_date": "2025-03-01",
    "end_date": "2032-03-01",
    "monthly_payment": 1500.00,
    "total_repayment": 126000.00,
    "loan_status": "approved",
    "collateral": {
      "type": "business equipment",
      "value": 120000.00
    }
  },
  {
    "loan_id": "loan_10006",
    "user_id": "user_2006",
    "loan_type": "home renovation",
    "loan_amount": 30000.00,
    "loan_term": 10,
    "interest_rate": 6.5,
    "start_date": "2024-07-01",
    "end_date": "2034-07-01",
    "monthly_payment": 300.00,
    "total_repayment": 36000.00,
    "loan_status": "disbursed",
    "collateral": {
      "type": "real estate",
      "value": 250000.00
    }
  },
  {
    "loan_id": "loan_10007",
    "user_id": "user_2007",
    "loan_type": "vacation",
    "loan_amount": 5000.00,
    "loan_term": 1,
    "interest_rate": 12.0,
    "start_date": "2025-04-01",
    "end_date": "2026-04-01",
    "monthly_payment": 450.00,
    "total_repayment": 5400.00,
    "loan_status": "approved",
    "collateral": null
  }
];

const LoansPage = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Loan Information
      </Typography>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Loan Type</TableCell>
                <TableCell>Loan Amount</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Monthly Payment</TableCell>
                <TableCell>Total Repayment</TableCell>
                <TableCell>Loan Status</TableCell>
                <TableCell>Collateral</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanData.map((loan) => (
                <TableRow key={loan.loan_id}>
                  <TableCell>{loan.loan_id}</TableCell>
                  <TableCell>{loan.user_id}</TableCell>
                  <TableCell>{loan.loan_type}</TableCell>
                  <TableCell>{`$${loan.loan_amount.toLocaleString()}`}</TableCell>
                  <TableCell>{loan.interest_rate}%</TableCell>
                  <TableCell>{loan.start_date}</TableCell>
                  <TableCell>{loan.end_date}</TableCell>
                  <TableCell>{`$${loan.monthly_payment.toLocaleString()}`}</TableCell>
                  <TableCell>{`$${loan.total_repayment.toLocaleString()}`}</TableCell>
                  <TableCell>{loan.loan_status}</TableCell>
                  <TableCell>
                    {loan.collateral
                      ? `${loan.collateral.type} - $${loan.collateral.value.toLocaleString()}`
                      : "None"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoansPage;
