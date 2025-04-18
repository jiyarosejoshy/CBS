
"use client";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Navbar from "@/components/ui/Navbar-admin";
import { createClient } from "@supabase/supabase-js";


// ✅ Initialize Supabase globally (Prevents multiple instances)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    renderCell: (params) => new Date(params.value).toLocaleString(),
  },
];

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRealtime, setIsRealtime] = useState(false);
  let pollingInterval = null;

  useEffect(() => {
    let subscription = null;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/admin/transactions");
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();
        const formattedData = data.map((transaction) => ({
          id: transaction.trans_id,
          accountNumber: transaction.account_no,
          firstName: transaction.first_name,
          lastName: transaction.last_name,
          creditDebit: transaction.type,
          balance: transaction.balance,
          timestamp: transaction.transac_time,
        }));
        console.log("Fetched transactions:", formattedData.length);
        setRows(formattedData);
      } catch (error) {
        setErrorMessage(`Error fetching transactions: ${error.message}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const setupRealtime = async () => {
      try {
        // 🟢 Subscribe to Supabase real-time updates
        subscription = supabase
          .channel("transactions-channel")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "transactions" },
            (payload) => {
              console.log("New transaction:", payload.new);
              const newTransaction = {
                id: payload.new.trans_id,
                accountNumber: payload.new.account_no,
                firstName: payload.new.first_name,
                lastName: payload.new.last_name,
                creditDebit: payload.new.type,
                balance: payload.new.balance,
                timestamp: payload.new.transac_time,
              };
              setRows((currentRows) => [newTransaction, ...currentRows]);
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log("✅ Real-time subscription enabled");
              setIsRealtime(true);
            }
          });
      } catch (error) {
        console.error("⚠️ Error setting up real-time:", error);
        setIsRealtime(false);
      }
    };

    // ✅ Fetch initial transactions
    fetchTransactions();

    // ✅ Start real-time updates
    setupRealtime();

    // ✅ Fallback polling (Only if real-time fails)
    pollingInterval = setInterval(() => {
      if (!isRealtime) {
        console.log("🔄 Polling for updates...");
        fetchTransactions();
      }
    }, 30000);

    // Cleanup on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isRealtime]);

  

return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    <div className="flex flex-col items-center gap-6 pt-20 px-4">
      <h1 className="text-4xl font-bold text-gray-800">User Transactions</h1>

      {isRealtime ? (
        <div className="text-green-600 text-sm">✅ Real-time updates enabled</div>
      ) : (
        <div className="text-gray-500 text-sm">🔄 Polling updates every 30s</div>
      )}

      {errorMessage && (
        <div className="text-red-600 text-sm bg-red-100 p-2 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="w-full max-w-6xl">
        <Paper
          elevation={3}
          sx={{
            height: 520,
            width: "100%",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pagination
            loading={loading}
            sx={{
              border: 0,
              fontFamily: "Inter, sans-serif",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f1f5f9",
                fontWeight: "600",
                fontSize: "0.9rem",
              },
              "& .MuiDataGrid-row": {
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#f9fafb",
                },
              },
              "& .MuiDataGrid-cell": {
                fontSize: "0.875rem",
              },
            }}
            disableRowSelectionOnClick
          />
        </Paper>
      </div>
    </div>
  </div>
)}
