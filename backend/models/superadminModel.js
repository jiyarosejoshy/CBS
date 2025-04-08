const supabase = require("../config/supabase"); // Import Supabase connection

// Get transactions for a specific branch
const getTransactionsByBranch = async (branchName) => {
    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("branch", branchName);

    if (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
    return data;
};
const getBranchs = async () => {
    console.log("📡 [Model] getBranchs() called");
  
    const { data, error } = await supabase
      .from("loans")
      .select("*");
  
    if (error) {
      console.error("❌ [Model] Supabase error:", error);
      throw error;
    }
  
    console.log("📦 [Model] Raw data received:", data);
  
    // Extract and filter unique branch names
    const uniqueBranches = [...new Set(
      data.map(item => item.branch).filter(branch => branch !== null)
    )];
  
    console.log("🌿 [Model] Unique branches extracted:", uniqueBranches);
  
    return uniqueBranches;
  };
  
// Get loans for a specific branch
const getLoansByBranch = async (branchName) => {
    const { data, error } = await supabase
        .from("loans")
        .select("*")
        .eq("branch", branchName);

    if (error) {
        console.error("Error fetching loans:", error);
        throw error;
    }
    return data;
};

module.exports = { getBranchs,getTransactionsByBranch, getLoansByBranch };
