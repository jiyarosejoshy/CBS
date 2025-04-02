"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import NavBar from "@/components/ui/NavBar";

const LoanPage = () => {
  const userId = "987f6543-e21b-11d3-a234-426614174002";
  
  const [formData, setFormData] = useState({
    loan_amount: "",
    loan_type: "",
    interest_rate: "12",
    duration: "12",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    collateral: ""
  });

  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);

  // Fetch existing loans
  useEffect(() => {
    console.log("Fetching existing loans...");
    axios.get("http://localhost:5000/api/loans/user/987f6543-e21b-11d3-a234-426614174002")
      .then(res => {
        console.log("Loans fetched:", res.data);
        setLoans(res.data);
      })
      .catch(err => {
        console.error("Loan fetch error:", err);
        alert("Failed to load loan history");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateEndDate = (startDate, months) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + parseInt(months));
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started with data:", formData);

    // Simple validation
    if (!formData.loan_amount || !formData.loan_type) {
      alert("Please fill all required fields!");
      console.warn("Validation failed - missing required fields");
      return;
    }

    setLoading(true);
    console.log("Submitting loan application...");

    try {
      const payload = {
        user_id: userId,
        loan_amount: parseFloat(formData.loan_amount),
        loan_type: formData.loan_type,
        interest_rate: parseFloat(formData.interest_rate),
        start_date: formData.start_date,
        end_date: calculateEndDate(formData.start_date, formData.duration),
        status: "pending",
        collateral_type: formData.collateral || "General Collateral",
        collateral_value: formData.loan_amount * 0.8
      };

      console.log("Final payload:", payload);

      const res = await axios.post("http://localhost:5000/api/loanrequest", payload);
      console.log("Submission successful:", res.data);
      
      alert("Loan application submitted successfully!");
      setFormData({
        loan_amount: "",
        loan_type: "",
        interest_rate: "12",
        duration: "12",
        start_date: new Date().toISOString().split('T')[0],
        end_date: "",
        collateral: ""
      });

      // Refresh loans list
      const newLoans = await axios.get("http://localhost:5000/api/loans/user/987f6543-e21b-11d3-a234-426614174002");
      setLoans(newLoans.data);
      
    } catch (error) {
      console.error("Submission failed:", error.response?.data || error.message);
      alert(`Submission failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Apply for Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loan Amount (₹)</Label>
                  <Input
                    name="loan_amount"
                    type="number"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    min="10000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Loan Type</Label>
                  <select
                    name="loan_type"
                    value={formData.loan_type}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select loan type</option>
                    <option value="personal">Personal Loan</option>
                    <option value="home">Home Loan</option>
                    <option value="car">Car Loan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input
                    name="interest_rate"
                    type="number"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    step="0.1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration (months)</Label>
                  <Input
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    min="6"
                    max="60"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Collateral Details</Label>
                  <Input
                    name="collateral"
                    value={formData.collateral}
                    onChange={handleChange}
                    placeholder="Property, vehicle, etc."
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {loans.length > 0 ? (
              <div className="space-y-3">
                {loans.map(loan => (
                  <div key={loan.loan_id} className="border p-4 rounded">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{loan.loan_type.replace('_', ' ')}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        loan.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        loan.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    <p>Amount: ₹{loan.loan_amount}</p>
                    <p>Interest: {loan.interest_rate}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No loans found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanPage;
// "use client";
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { toast } from "sonner";
// import axios from "axios";
// import NavBar from "@/components/ui/NavBar";

// const LoanPage = () => {
//   const [loanData, setLoanData] = useState({
//     amount: "",
//     purpose: "",
//     duration: "12",
//   });
//   const [collateral, setCollateral] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [existingLoans, setExistingLoans] = useState([]);
//   const [loansError, setLoansError] = useState(null);


//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/loans/user/987f6543-e21b-11d3-a234-426614174002"
//         );
//         setExistingLoans(response.data);
//       } catch (error) {
//         console.error("Failed to fetch loans:", error);
//         setLoansError("Failed to load loan history");
//       }
//     };

//     fetchLoans();
//   }, []);


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setLoanData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === "application/pdf") {
//       setCollateral(file);
//       toast.success("PDF uploaded successfully");
//     } else {
//       toast.error("Please upload a PDF file only");
//     }
//   };

//   const submitLoanApplication = async () => {
//     setIsLoading(true);
//     const toastId = toast.loading("Processing your loan application...");
    
//     try {
//       const formData = new FormData();
//       formData.append('amount', loanData.amount);
//       formData.append('purpose', loanData.purpose);
//       formData.append('duration', loanData.duration);
//       formData.append('collateral', collateral);

//       const response = await axios.post(
//         'http://localhost:5000/api/loans/user/987f6543-e21b-11d3-a234-426614174002', 
//         formData, 
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       toast.success("Loan application submitted!", {
//         id: toastId,
//         description: "Your application is under review",
//       });

//       // Reset form
//       setLoanData({ amount: "", purpose: "", duration: "12" });
//       setCollateral(null);

//     } catch (error) {
//       toast.error("Application failed", {
//         id: toastId,
//         description: error.response?.data?.message || "Please try again later",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//           <NavBar />
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       {/* Loan Application Form */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Apply for Loan</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="amount">Loan Amount ($)</Label>
//               <Input
//                 id="amount"
//                 name="amount"
//                 type="number"
//                 value={loanData.amount}
//                 onChange={handleInputChange}
//                 min="1000"
//                 max="50000"
//                 required
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="duration">Duration (months)</Label>
//               <Input
//                 id="duration"
//                 name="duration"
//                 type="number"
//                 value={loanData.duration}
//                 onChange={handleInputChange}
//                 min="6"
//                 max="60"
//                 required
//               />
//             </div>
            
//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="purpose">Purpose</Label>
//               <Input
//                 id="purpose"
//                 name="purpose"
//                 value={loanData.purpose}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
            
//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="collateral">Collateral (PDF)</Label>
//               <Input
//                 id="collateral"
//                 type="file"
//                 accept=".pdf"
//                 onChange={handleFileUpload}
//                 required
//               />
//             </div>
//           </div>
//         </CardContent>
//           <Button 
//             onClick={submitLoanApplication}
//             disabled={isLoading || !loanData.amount || !collateral}
//             className="w-full"
//           >
//             {isLoading ? "Processing..." : "Submit Application"}
//           </Button>
//       </Card>

//       {/* Existing Loans Display */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Your Loans</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {existingLoans.length > 0 ? (
//             existingLoans.map(loan => (
//               <div key={loan.loan_id} className="border rounded-lg p-4">
//                 <div className="flex justify-between">
//                   <div>
//                     <h3 className="font-medium">{loan.loan_type} Loan</h3>
//                     <p className="text-sm text-muted-foreground">ID: {loan.loan_id}</p>
//                   </div>
//                   <span className={`px-2 py-1 rounded text-xs ${
//                     loan.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {loan.status}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2 mt-3">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Amount</p>
//                     <p>${loan.loan_amount}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Rate</p>
//                     <p>{loan.interest_rate}%</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Collateral</p>
//                     <p>{loan.collateral_type}</p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-muted-foreground">No active loans found</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//     </div>

//   );
// };

// export default LoanPage;