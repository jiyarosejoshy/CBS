const supabase = require("../config/supabase");

// ✅ Create a new account
const createAccount = async ({ user_id, balance, account_type, account_no }) => {
    const { data, error } = await supabase
        .from("accounts")
        .insert([
            {
                user_id,
                balance,
                account_type,
                account_no
            }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ✅ Fetch account details using account number
const getAccountByNumber = async (account_no) => {
    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("account_no", account_no)
        .single();

    if (error) throw error;
    return data;
};

// ✅ Update account balance
const updateBalance = async (account_no, newBalance) => {
    const { error } = await supabase
        .from("accounts")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("account_no", account_no);

    if (error) throw error;
};

// ✅ Delete an account
const deleteAccount = async (account_no) => {
    const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("account_no", account_no);

    if (error) throw error;
};

module.exports = {
    createAccount,
    getAccountByNumber,
    updateBalance,
    deleteAccount
};
