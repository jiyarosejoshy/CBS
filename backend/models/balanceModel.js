const supabase = require("../config/supabase");

const BalanceModel = {

   
    // ✅ Set opening balance for a date
    async setOpeningBalance(branch, open) {
        const { data, error } = await supabase
            .from("balances")
            .upsert([{ branch, open }], { onConflict: ["branch"] });
    
        if (error) throw error;
        return open;
    },

    // ✅ Get opening balance for a date
    async getOpeningBalance(branch) {
        const { data, error } = await supabase
            .from("balances")
            .select("open")
            .eq("branch", branch)
            .single();

        if (error) return null;
        return data?.open;
    },

    // ✅ Set closing balance for a date
    async setClosingBalance(branch, close) {
        const { data, error } = await supabase
            .from("balances")
            .update({ close })
            .eq("branch", branch);

        if (error) throw error;
        return data;
    },

    // ✅ Get closing balance for a date
    async getClosingBalance(branch) {
        const { data, error } = await supabase
            .from("balances")
            .select("close,date")
            .eq("branch", branch)
            .single();

        if (error) return null;
        return data?.close;
    },

    // ✅ Calculate closing balance (Opening Balance + Transactions)
    async calculateClosingBalance(date,branch) {
        const openingBalance = await this.getOpeningBalance(branch);
        console.log(branch);
        console.log(date);
        console.log(openingBalance);
        if (openingBalance === null) return null;

        const { data: transactions, error } = await supabase
            .from("teller")
            .select("amount, trans_type")
            .eq("branch",branch)
            .eq("date", date);

        

        if (error) throw error;

        let closingBalance = openingBalance;
        transactions.forEach(({ amount, trans_type }) => {
            console.log(amount);
            console.log(trans_type);
            closingBalance += trans_type === "Deposit" ? amount : -amount;
        });

        await this.setClosingBalance(branch, closingBalance);
        return closingBalance;
    }
};

module.exports = BalanceModel;
