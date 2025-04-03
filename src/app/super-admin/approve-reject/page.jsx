"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import NavBar from "@/components/ui/Navbar-supa";
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
// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableRow, 
//   Typography, 
//   Card, 
//   CardContent,
//   Button,
//   Chip,
//   Box
// } from "@mui/material";

// const ApproveRejectPage = () => {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPendingLoans = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/admin/loans/pending");
//         setLoans(response.data);
//       } catch (error) {
//         console.error("Error fetching pending loans:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPendingLoans();
//   }, []);

//   const handleStatusUpdate = async (loan_id, newStatus) => {
//     try {
//       await axios.patch(`http://localhost:5000/admin/loans/${loan_id}/${newStatus}`, {
//         status: newStatus
//       });
//       setLoans(loans.filter(loan => loan.loan_id !== loan_id));
//     } catch (error) {
//       console.error("Error updating loan status:", error);
//     }
//   };

//   if (loading) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Loan Approval Dashboard
//       </Typography>
//       <Card>
//         <CardContent>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Loan ID</TableCell>
//                 <TableCell>Applicant</TableCell>
//                 <TableCell>Amount</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loans.map((loan) => (
//                 <TableRow key={loan.loan_id}>
//                   <TableCell>{loan.loan_id}</TableCell>
//                   <TableCell>{loan.user_id}</TableCell>
//                   <TableCell>₹{loan.loan_amount.toLocaleString()}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={loan.loan_type.replace('_', ' ')} 
//                       color="primary" 
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={loan.status} 
//                       color={
//                         loan.status === 'APPROVED' ? 'success' : 
//                         loan.status === 'REJECTED' ? 'error' : 'warning'
//                       }
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <Button 
//                         variant="contained" 
//                         color="success"
//                         size="small"
//                         onClick={() => handleStatusUpdate(loan.loan_id, 'APPROVED')}
//                       >
//                         Approve
//                       </Button>
//                       <Button 
//                         variant="contained" 
//                         color="error"
//                         size="small"
//                         onClick={() => handleStatusUpdate(loan.loan_id, 'REJECTED')}
//                       >
//                         Reject
//                       </Button>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ApproveRejectPage;


// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { createClient } from "@supabase/supabase-js";
// import NavBar from "@/components/ui/Navbar-admin";
// import { Button } from "@/components/ui/button";

// // ✅ Initialize Supabase Client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const ApproveRejectLoans = () => {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/admin/loans/pending"); // Fetch only pending loans
//         setLoans(response.data);
//       } catch (err) {
//         setError("Failed to fetch loans");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLoans();

//     // ✅ Subscribe to real-time changes
//     const loanChannel = supabase
//       .channel("loans-channel")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "loans" },
//         (payload) => {
//           console.log("Loan updated:", payload.new);

//           // ✅ Remove the loan if it gets approved/rejected
//           if (payload.new.status === "approved" || payload.new.status === "rejected") {
//             setLoans((prevLoans) =>
//               prevLoans.filter((loan) => loan.loan_id !== payload.new.loan_id)
//             );
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(loanChannel);
//     };
//   }, []);

//   const updateLoanStatus = async (loan_id, action) => {
//     try {
//       await axios.patch(`http://localhost:5000/admin/loans/${loan_id}/${action}`);
      
//       // ✅ Remove the loan immediately from the UI without waiting for real-time update
//       setLoans((prevLoans) => prevLoans.filter((loan) => loan.loan_id !== loan_id));
//     } catch (err) {
//       setError(`Failed to update loan status to ${action}`);
//     }
//   };

//   if (loading) return <p>Loading loans...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div>
//       <NavBar />
//       <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
//         <h1 className="text-3xl font-bold mb-4">Approve/Reject Loans</h1>

//         <div className="bg-black p-4 rounded-lg shadow">
//           {loans.length > 0 ? (
//             loans.map((loan) => (
//               <div key={loan.loan_id} className="flex justify-between border-b border-gray-700 py-4">
//                 <div className="w-2/3">
//                   <p><strong>Loan ID:</strong> {loan.loan_id}</p>
//                   <p><strong>Loan Type:</strong> {loan.loan_type}</p>
//                   <p><strong>Loan Amount:</strong> ${loan.loan_amount.toLocaleString()}</p>
//                   <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
//                   <p><strong>Start Date:</strong> {loan.start_date}</p>
//                   <p><strong>End Date:</strong> {loan.end_date}</p>
//                   <p><strong>Status:</strong> {loan.status}</p>
//                   <p>
//                     <strong>Collateral:</strong>{" "}
//                     {loan.collateral_type
//                       ? `${loan.collateral_type} - $${loan.collateral_value?.toLocaleString() || "None"}`
//                       : "None"}
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <Button
//                     onClick={() => updateLoanStatus(loan.loan_id, "approve")}
//                     className="bg-green-500 hover:bg-green-700 text-white px-4 py-2"
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     onClick={() => updateLoanStatus(loan.loan_id, "reject")}
//                     className="bg-red-500 hover:bg-red-700 text-white px-4 py-2"
//                   >
//                     Reject
//                   </Button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400">No pending loans available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApproveRejectLoans;
