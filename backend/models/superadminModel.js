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

module.exports = { getTransactionsByBranch, getLoansByBranch };
