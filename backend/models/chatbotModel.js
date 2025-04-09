const dotenv = require("dotenv");
dotenv.config();

const Groq = require("groq-sdk");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fetch account details from Supabase
const getAccountByNumber = async (account_no) => {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("account_no", account_no)
    .single();

  if (error) return null;
  return data;
};

// Handle static FAQ-based replies
const getFaqResponse = async (message) => {
  const msg = message.toLowerCase();

  

  if (msg.includes("loan") && msg.includes("apply")) {
    return "To apply for a loan, go to the 'Loans' section in our app. You can check eligibility and upload documents online.";
  }

  if (msg.includes("customer care") || msg.includes("support")) {
    return "You can reach customer care at 📞 1800-123-4567 or support@ourcorp.org We're available 24x7!";
  }


  if (msg.includes("working hours") || msg.includes("bank timings")) {
    return "Our branch hours are Mon–Fri: 9:30 AM – 4:30 PM, Sat: 9:30 AM – 1 PM. Closed Sundays and public holidays.";
  }

  return null; // not an FAQ
};

// Main chatbot handler
const getChatbotResponse = async (message) => {
  try {
    // 1. FAQ Response
    const faqReply = await getFaqResponse(message);
    if (faqReply) return faqReply;

    // 2. Check for account details request
    if (message.toLowerCase().includes("account details")) {
      const account_no = message.match(/\d{6,}/)?.[0]; // Adjust digits based on your account number length

      if (!account_no) return "Please provide a valid account number.";

      const account = await getAccountByNumber(account_no);

      if (!account) return "Account not found. Please check your account number.";

      return `Here are your account details:\n
🔹 Account No: ${account.account_no}
🔹 Balance: ₹${account.balance}
🔹 Type: ${account.account_type}`;
    }

    // 3. General AI chatbot fallback
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "llama-3-3b-8192",
    });

    return chatCompletion.choices[0]?.message?.content || "I couldn't process that.";
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "Sorry, there was an issue processing your request.";
  }
};

module.exports = { getChatbotResponse };
