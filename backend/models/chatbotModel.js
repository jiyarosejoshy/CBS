const dotenv = require("dotenv");
dotenv.config();
const Groq = require("groq-sdk");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Function to fetch account details from Supabase
const getAccountByNumber = async (account_no) => {
    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("account_no", account_no)
        .single();

    if (error) return null;
    return data;
};

const getChatbotResponse = async (message) => {
    try {
        // Check if the message is about account details
        if (message.toLowerCase().includes("account details")) {
            const account_no = message.match(/\d+/)?.[0]; // Extract account number from message

            if (!account_no) return "Please provide a valid account number.";

            const account = await getAccountByNumber(account_no);
            
            if (!account) return "Account not found. Please check your account number.";

            return `Here are your account details:\n
                    
                    🔹 Account No: ${account.account_no}\n
                    🔹 Balance: ₹${account.balance}\n
                    🔹 Type: ${account.account_type}`;
        }

        // If the message is not about account details, send it to the chatbot AI
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "llama-3.3-70b-versatile",
        });

        return chatCompletion.choices[0]?.message?.content || "I couldn't process that.";
    } catch (error) {
        console.error("Error:", error);
        return "Sorry, there was an issue processing your request.";
    }
};

module.exports = { getChatbotResponse };
