const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY); // Debugging check

const Groq = require('groq-sdk'); // Use require() instead of import

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function main() {
    try {
        const chatCompletion = await getGroqChatCompletion();
        console.log(chatCompletion.choices[0]?.message?.content || "");
    } catch (error) {
        console.error("Error fetching completion:", error);
    }
}

async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Explain the importance of fast language models",
            },
        ],
        model: "llama-3.3-70b-versatile",
    });
}

// Call the main function to run the script
main();
