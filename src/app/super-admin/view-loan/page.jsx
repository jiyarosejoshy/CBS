"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "@/components/ui/Navbar-supa";

const LoanList = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Branch Names
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/branch/loan/branches")
      .then((response) => setBranches(response.data))
      .catch((error) => console.error("Error fetching branches:", error));
  }, []);

  // Fetch Loans When Branch is Selected
  useEffect(() => {
    if (selectedBranch) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/branch/loans/${selectedBranch}`)
        .then((response) => setLoans(response.data))
        .catch((error) => console.error("Error fetching loans:", error))
        .finally(() => setLoading(false));
    }
  }, [selectedBranch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto p-6">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Loan Branch Filter</h1>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select a Branch
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loan Table Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Details</h2>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500">Loading loans...</p>
            </div>
          ) : loans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${loan.loan_amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500">No loans found for this branch.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanList;
