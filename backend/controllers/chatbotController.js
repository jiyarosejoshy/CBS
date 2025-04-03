const { getChatbotResponse } = require("../models/chatbotModel");

const chatbotHandler = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await getChatbotResponse(message);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { chatbotHandler };
