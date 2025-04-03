const dotenv = require("dotenv");
dotenv.config();

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const getChatbotResponse = async (message) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile",
        });

        return chatCompletion.choices[0]?.message?.content || "I couldn't process that.";
    } catch (error) {
        throw new Error("Error fetching chatbot response");
    }
};

module.exports = { getChatbotResponse };
