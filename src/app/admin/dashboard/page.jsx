"use client";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Navbar from "@/components/ui/Navbar-admin";

// Define columns for DataGrid
const columns = [
  { field: "accountNumber", headerName: "Account Number", width: 150 },
  { field: "firstName", headerName: "First Name", width: 130 },
  { field: "lastName", headerName: "Last Name", width: 130 },
  { field: "creditDebit", headerName: "Credit/Debit", width: 150 },
  { field: "balance", headerName: "Balance", width: 160 },
  {
    field: "timestamp",
    headerName: "Transaction Time",
    width: 200,
    renderCell: (params) => new Date(params.value).toLocaleString(), // Format timestamp
  },
];

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();

        // Map API response to match DataGrid columns
        const formattedData = data.map((transaction) => ({
          id: transaction.trans_id, // MUI DataGrid requires an `id` field
          accountNumber: transaction.account_no,
          firstName: transaction.first_name,
          lastName: transaction.last_name,
          creditDebit: transaction.type, // Use bracket notation for "c/d"
          balance: transaction.balance,
          timestamp: transaction.transac_time,
        }));
        console.log("formattedData", formattedData);
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center gap-10 h-screen">
        <div className="text-4xl font-semibold">Admin Panel</div>
        <div className="w-1/2">
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              pagination
              loading={loading}
              sx={{ border: 0 }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
}
