const supabase = require("../config/supabase");

// ✅ Create a new teller transaction
const createTellerTransaction = async (trans_id, amount, trans_type, acc_no, first_name, last_name) => {
    const { data, error } = await supabase.from("teller").insert([
        {
            trans_id,
            amount,
            trans_type,
            acc_no,
            first_name,
            last_name,
            date: new Date().toISOString()
        }
    ]).select().single();

    if (error) {
        console.error("Error creating teller transaction:", error);
        throw error;
    }
    return data;
};

// ✅ Get all teller transactions
const getAllTellerTransactions = async () => {
    const { data, error } = await supabase.from("teller").select("*");

    if (error) {
        console.error("Error fetching teller transactions:", error);
        throw error;
    }
    return data;
};

// ✅ Get a teller transaction by transaction ID (`trans_id`)
const getTellerTransactionById = async (trans_id) => {
    const { data, error } = await supabase.from("teller").select("*").eq("trans_id", trans_id).single();

    if (error) {
        console.error("Error fetching teller transaction by ID:", error);
        throw error;
    }
    return data;
};

// ✅ Update a teller transaction based on `trans_id`
const updateTellerTransaction = async (trans_id, updatedFields) => {
    const { data, error } = await supabase.from("teller").update(updatedFields).eq("trans_id", trans_id).select().single();

    if (error) {
        console.error("Error updating teller transaction:", error);
        throw error;
    }
    return data;
};

// ✅ Delete a teller transaction based on `trans_id`
const deleteTellerTransaction = async (trans_id) => {
    const { data, error } = await supabase.from("teller").delete().eq("trans_id", trans_id);

    if (error) {
        console.error("Error deleting teller transaction:", error);
        throw error;
    }
    return data;
};
// const saveOpeningBalance = async (date, opening_balance) => {
//     const { data, error } = await supabase
//         .from("opening_balances")
//         .upsert([{ date, opening_balance }], { onConflict: ['date'] });

//     if (error) throw error;
//     return data;
// };
// const getOpeningBalance = async (date) => {
//     const { data, error } = await supabase
//         .from("opening_balances")
//         .select("opening_balance")
//         .eq("date", date)
//         .single();

//     if (error) return null;
//     return data?.opening_balance;
// };

module.exports = {
    createTellerTransaction,
    getAllTellerTransactions,
    getTellerTransactionById,
    updateTellerTransaction,
    deleteTellerTransaction

};
