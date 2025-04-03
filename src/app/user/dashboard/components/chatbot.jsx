"use client";
import { useState } from "react";
import axios from "axios";
import { MessageSquare, X } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        message: message,
        option: selectedOption, // Send selected option
      });

      console.log("Chatbot Response:", response.data.response);

      const botMessage = { role: "bot", content: response.data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
    setSelectedOption(""); // Reset selection
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Chat Button */}
      {!isOpen && (
        <button
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 flex justify-between">
            <span>Chatbot</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Options */}
          <div className="p-4 bg-gray-100">
            <p className="mb-2 font-semibold">Select an option:</p>
            <div className="grid grid-cols-2 gap-2">
              {["Account Balance", "Transaction Details", "Customer Care", "Loan Eligibility"].map((option) => (
                <button
                  key={option}
                  className={`p-2 rounded-lg border ${
                    selectedOption === option ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-2 rounded-lg max-w-xs ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-black self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex p-2 bg-white border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={() => sendMessage(input)}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
