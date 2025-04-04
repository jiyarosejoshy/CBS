const supabase = require("../config/supabase");

const BalanceModel = {

   
    // ✅ Set opening balance for a date
    async setOpeningBalance(date, open) {
        const { data, error } = await supabase
            .from("balances")
            .upsert([{ date, open }], { onConflict: ["date"] });

        if (error) throw error;
        return data;
    },

    // ✅ Get opening balance for a date
    async getOpeningBalance(date) {
        const { data, error } = await supabase
            .from("balances")
            .select("open")
            .eq("date", date)
            .single();

        if (error) return null;
        return data?.open;
    },

    // ✅ Set closing balance for a date
    async setClosingBalance(date, close) {
        const { data, error } = await supabase
            .from("balances")
            .update({ close })
            .eq("date", date);

        if (error) throw error;
        return data;
    },

    // ✅ Get closing balance for a date
    async getClosingBalance(date) {
        const { data, error } = await supabase
            .from("balances")
            .select("close")
            .eq("date", date)
            .single();

        if (error) return null;
        return data?.close;
    },

    // ✅ Calculate closing balance (Opening Balance + Transactions)
    async calculateClosingBalance(date) {
        const openingBalance = await this.getOpeningBalance(date);
        if (openingBalance === null) return null;

        const { data: transactions, error } = await supabase
            .from("teller")
            .select("amount, trans_type")
            .eq("date", date);

        if (error) throw error;

        let closingBalance = openingBalance;
        transactions.forEach(({ amount, trans_type }) => {
            closingBalance += trans_type === "Deposit" ? amount : -amount;
        });

        await this.setClosingBalance(date, closingBalance);
        return closingBalance;
    }
};

module.exports = BalanceModel;
