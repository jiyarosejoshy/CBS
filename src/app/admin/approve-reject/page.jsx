// "use client";  // Required for client-side navigation
// import React, { useState } from "react";
// import NavBar from "@/components/ui/Navbar-admin";
// import { Button } from "@/components/ui/button";

// const approveRejectLoans = () => {
//   const [loans, setLoans] = useState([
//     {
//       loan_id: "loan_10001",
//       user_id: "user_2001",
//       loan_type: "home",
//       loan_amount: 350000.00,
//       loan_term: 20,
//       interest_rate: 4.5,
//       start_date: "2024-05-01",
//       end_date: "2044-05-01",
//       monthly_payment: 2200.00,
//       total_repayment: 528000.00,
//       loan_status: "approved",
//       collateral: {
//         type: "real estate",
//         value: 400000.00
//       }
//     },
//     {
//       loan_id: "loan_10002",
//       user_id: "user_2002",
//       loan_type: "auto",
//       loan_amount: 25000.00,
//       loan_term: 5,
//       interest_rate: 7.0,
//       start_date: "2025-01-15",
//       end_date: "2030-01-15",
//       monthly_payment: 500.00,
//       total_repayment: 30000.00,
//       loan_status: "disbursed",
//       collateral: {
//         type: "vehicle",
//         value: 30000.00
//       }
//     },
//     {
//       loan_id: "loan_10003",
//       user_id: "user_2003",
//       loan_type: "personal",
//       loan_amount: 15000.00,
//       loan_term: 3,
//       interest_rate: 9.5,
//       start_date: "2023-06-10",
//       end_date: "2026-06-10",
//       monthly_payment: 500.00,
//       total_repayment: 18000.00,
//       loan_status: "pending",
//       collateral: null
//     },
//     // Add other loans from the provided data...
//   ]);

//   const updateLoanStatus = (loan_id, status) => {
//     const updatedLoans = loans.map((loan) =>
//       loan.loan_id === loan_id ? { ...loan, loan_status: status } : loan
//     );
//     setLoans(updatedLoans);
//   };

//   return (
//     <div>
//       <NavBar />
//       <div className="max-w-7xl mx-auto p-6 bg-black text-white rounded-lg shadow-md mt-5">
//         <h1 className="text-3xl font-bold mb-4">Approve/Reject Loans</h1>

//         <div className="bg-black p-4 rounded-lg shadow">
//           {loans.map((loan) => (
//             <div key={loan.loan_id} className="flex justify-between border-b border-gray-700 py-4">
//               <div className="w-2/3">2
//                 <p><strong>Loan ID:</strong> {loan.loan_id}</p>
//                 <p><strong>Loan Type:</strong> {loan.loan_type}</p>
//                 <p><strong>Loan Amount:</strong> ${loan.loan_amount.toLocaleString()}</p>
//                 <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
//                 <p><strong>Start Date:</strong> {loan.start_date}</p>
//                 <p><strong>End Date:</strong> {loan.end_date}</p>
//                 <p><strong>Status:</strong> {loan.loan_status}</p>
//                 <p><strong>Collateral:</strong> {loan.collateral ? `${loan.collateral.type} - $${loan.collateral.value.toLocaleString()}` : "None"}</p>
//               </div>

//               <div className="flex items-center gap-4">
//                 <Button
//                   onClick={() => updateLoanStatus(loan.loan_id, "approved")}
//                   className="bg-green-500 hover:bg-green-700 text-white px-4 py-2"
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   onClick={() => updateLoanStatus(loan.loan_id, "rejected")}
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

// export default approveRejectLoans;

"use client"; // Required for client-side navigation
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/ui/Navbar-admin";
import { Button } from "@/components/ui/button";

const ApproveRejectLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/loans/pending"); // Update with actual API endpoint
        setLoans(response.data);
      } catch (err) {
        setError("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const updateLoanStatus = async (loan_id, action) => {
    try {
      await axios.patch(`http://localhost:5000/admin/loans/${loan_id}/${action}`); // Patch endpoint without status
      setLoans(loans.map(loan => (loan.loan_id === loan_id ? { ...loan, status: action } : loan)));
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
          {loans.map((loan) => (
            <div key={loan.id} className="flex justify-between border-b border-gray-700 py-4">
              <div className="w-2/3">
                <p><strong>Loan ID:</strong> {loan.loan_id}</p>
                <p><strong>Loan Type:</strong> {loan.loan_type}</p>
                <p><strong>Loan Amount:</strong> ${loan.loan_amount.toLocaleString()}</p>
                <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
                <p><strong>Start Date:</strong> {loan.start_date}</p>
                <p><strong>End Date:</strong> {loan.end_date}</p>
                <p><strong>Status:</strong> {loan.status}</p>
                <p><strong>Collateral:</strong> {loan.collateral_type ? `${loan.collateral_type} - $${loan.collateral_value ? loan.collateral_value.toLocaleString() : "None"}` : "None"}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectLoans;