

// "use client"; // Required for client-side navigation
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import NavBar from "@/components/ui/Navbar-admin";
// import { Button } from "@/components/ui/button";

// const ApproveRejectLoans = () => {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/admin/loans/pending"); // Update with actual API endpoint
//         setLoans(response.data);
//       } catch (err) {
//         setError("Failed to fetch loans");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLoans();
//   }, []);

//   const updateLoanStatus = async (loan_id, action) => {
//     try {
//       await axios.patch(`http://localhost:5000/admin/loans/${loan_id}/${action}`); // Patch endpoint without status
//       setLoans(loans.map(loan => (loan.loan_id === loan_id ? { ...loan, status: action } : loan)));
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
//           {loans.map((loan) => (
//             <div key={loan.id} className="flex justify-between border-b border-gray-700 py-4">
//               <div className="w-2/3">
//                 <p><strong>Loan ID:</strong> {loan.loan_id}</p>
//                 <p><strong>Loan Type:</strong> {loan.loan_type}</p>
//                 <p><strong>Loan Amount:</strong> ${loan.loan_amount.toLocaleString()}</p>
//                 <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
//                 <p><strong>Start Date:</strong> {loan.start_date}</p>
//                 <p><strong>End Date:</strong> {loan.end_date}</p>
//                 <p><strong>Status:</strong> {loan.status}</p>
//                 <p><strong>Collateral:</strong> {loan.collateral_type ? `${loan.collateral_type} - $${loan.collateral_value ? loan.collateral_value.toLocaleString() : "None"}` : "None"}</p>
//               </div>

//               <div className="flex items-center gap-4">
//                 <Button
//                   onClick={() => updateLoanStatus(loan.loan_id, "approve")}
//                   className="bg-green-500 hover:bg-green-700 text-white px-4 py-2"
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   onClick={() => updateLoanStatus(loan.loan_id, "reject")}
//                   className="bg-red-500 hover:bg-red-700 text-white px-4 py-2"
//                 >
//                   Reject
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApproveRejectLoans;
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import NavBar from "@/components/ui/Navbar-admin";
import { Button } from "@/components/ui/button";

// ✅ Initialize Supabase Client
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
        const response = await axios.get("http://localhost:5000/admin/loans/pending"); // Fetch only pending loans
        setLoans(response.data);
      } catch (err) {
        setError("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();

    // ✅ Subscribe to real-time changes
    const loanChannel = supabase
      .channel("loans-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "loans" },
        (payload) => {
          console.log("Loan updated:", payload.new);

          // ✅ Remove the loan if it gets approved/rejected
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
      
      // ✅ Remove the loan immediately from the UI without waiting for real-time update
      setLoans((prevLoans) => prevLoans.filter((loan) => loan.loan_id !== loan_id));
    } catch (err) {
      setError(`Failed to update loan status to ${action}`);
    }
  };

  if (loading) return <p>Loading loans...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold mb-4">Approve/Reject Loans</h1>

        <div className="bg-black p-4 rounded-lg shadow">
          {loans.length > 0 ? (
            loans.map((loan) => (
              <div key={loan.loan_id} className="flex justify-between border-b border-gray-700 py-4">
                <div className="w-2/3">
                  <p><strong>Loan ID:</strong> {loan.loan_id}</p>
                  <p><strong>Loan Type:</strong> {loan.loan_type}</p>
                  <p><strong>Loan Amount:</strong> ${loan.loan_amount.toLocaleString()}</p>
                  <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
                  <p><strong>Start Date:</strong> {loan.start_date}</p>
                  <p><strong>End Date:</strong> {loan.end_date}</p>
                  <p><strong>Status:</strong> {loan.status}</p>
                  <p>
                    <strong>Collateral:</strong>{" "}
                    {loan.collateral_type
                      ? `${loan.collateral_type} - $${loan.collateral_value?.toLocaleString() || "None"}`
                      : "None"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => updateLoanStatus(loan.loan_id, "approve")}
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => updateLoanStatus(loan.loan_id, "reject")}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No pending loans available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectLoans;
