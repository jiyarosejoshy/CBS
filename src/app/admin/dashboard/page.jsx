// "use client";
// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";
// import Navbar from "@/components/ui/Navbar-admin";

// // Define columns for DataGrid
// const columns = [
//   { field: "accountNumber", headerName: "Account Number", width: 150 },
//   { field: "firstName", headerName: "First Name", width: 130 },
//   { field: "lastName", headerName: "Last Name", width: 130 },
//   { field: "creditDebit", headerName: "Credit/Debit", width: 150 },
//   { field: "balance", headerName: "Balance", width: 160 },
//   {
//     field: "timestamp",
//     headerName: "Transaction Time",
//     width: 200,
//     renderCell: (params) => new Date(params.value).toLocaleString(), // Format timestamp
//   },
// ];

// export default function DataTable() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/admin/transactions");
//         if (!response.ok) {
//           throw new Error("Failed to fetch transactions");
//         }
//         const data = await response.json();

//         // Map API response to match DataGrid columns
//         const formattedData = data.map((transaction) => ({
//           id: transaction.trans_id, // MUI DataGrid requires an `id` field
//           accountNumber: transaction.account_no,
//           firstName: transaction.first_name,
//           lastName: transaction.last_name,
//           creditDebit: transaction.type, // Use bracket notation for "c/d"
//           balance: transaction.balance,
//           timestamp: transaction.transac_time,
//         }));
//         console.log("formattedData", formattedData);
//         setRows(formattedData);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   return (
//     <div>
//       <Navbar />
//       <div className="flex flex-col justify-center items-center gap-10 h-screen">
//         <div className="text-4xl font-semibold">Admin Panel</div>
//         <div className="w-1/2">
//           <Paper sx={{ height: 400, width: "100%" }}>
//             <DataGrid
//               rows={rows}
//               columns={columns}
//               pageSizeOptions={[5, 10]}
//               pagination
//               loading={loading}
//               sx={{ border: 0 }}
//             />
//           </Paper>
//         </div>
//       </div>
//     </div>
//   );
// }


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
  const [errorMessage, setErrorMessage] = useState('');
  const [isRealtime, setIsRealtime] = useState(false);

  useEffect(() => {
    let supabase;
    let subscription;

    const setupRealtime = async () => {
      try {
        // Dynamically import Supabase to avoid SSR issues
        const { createClient } = await import('@supabase/supabase-js');
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        // Check if Supabase credentials are available
        if (!supabaseUrl || !supabaseKey) {
          console.warn('Supabase credentials not found. Falling back to REST API.');
          setIsRealtime(false);
          return;
        }
        
        // Initialize Supabase client
        supabase = createClient(supabaseUrl, supabaseKey);
        
        // Set up real-time subscription for transactions
        subscription = supabase
          .channel('transactions-channel')
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'transactions' 
          }, payload => {
            console.log('New transaction added:', payload.new);
            // Format and add the new transaction to state
            const newTransaction = {
              id: payload.new.trans_id,
              accountNumber: payload.new.account_no,
              firstName: payload.new.first_name,
              lastName: payload.new.last_name,
              creditDebit: payload.new.type,
              balance: payload.new.balance,
              timestamp: payload.new.transac_time,
            };
            setRows(currentRows => [newTransaction, ...currentRows]);
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Real-time subscription enabled');
              setIsRealtime(true);
            }
          });
          
        console.log('Supabase real-time setup complete');
      } catch (error) {
        console.error('Error setting up real-time:', error);
        setIsRealtime(false);
      }
    };

    // Setup polling for non-realtime updates as fallback
    let pollingInterval;
    
    // Initial fetch of data
    fetchTransactions();
    
    // Try to set up real-time updates
    setupRealtime();
    
    // Set up polling as a fallback if real-time isn't available
    // This will be cleared if real-time is successfully established
    pollingInterval = setInterval(() => {
      if (!isRealtime) {
        console.log('Polling for updates...');
        fetchTransactions();
      }
    }, 30000); // Poll every 30 seconds

    // Cleanup on unmount
    return () => {
      if (subscription && supabase) {
        supabase.removeChannel(subscription);
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isRealtime]);

  async function fetchTransactions() {
    try {
      setLoading(true);
      
      const response = await fetch("http://localhost:5000/admin/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();

      // Map API response to match DataGrid columns
      const formattedData = data.map((transaction) => ({
        id: transaction.trans_id,
        accountNumber: transaction.account_no,
        firstName: transaction.first_name,
        lastName: transaction.last_name,
        creditDebit: transaction.type,
        balance: transaction.balance,
        timestamp: transaction.transac_time,
      }));
      
      console.log('Fetched transactions:', formattedData.length);
      setRows(formattedData);
    } catch (error) {
      setErrorMessage(`Error fetching transactions: ${error.message}`);
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center gap-10 h-screen">
        <div className="text-4xl font-semibold">Admin Panel</div>
        {isRealtime && (
          <div className="text-green-600 text-sm">Real-time updates enabled</div>
        )}
        {errorMessage && (
          <div className="text-red-600 mb-4">{errorMessage}</div>
        )}
        <div className="w-3/4">
          <Paper sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pagination
              loading={loading}
              sx={{ border: 0 }}
              disableRowSelectionOnClick
            />
          </Paper>
        </div>
      </div>
    </div>
  );
} 