"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I'm your Cooperative Banking Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        message: input,
      });

      setTimeout(() => {
        const botMessage = { role: "bot", content: response.data.response };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000); // Simulate typing delay
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "bot",
        content: "⚠️ Connection issue. Please try again shortly.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <MessageSquare className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[400px] h-[560px] flex flex-col bg-white/90 backdrop-blur-sm border border-gray-200/80 shadow-2xl overflow-hidden">
          {/* Header with Glassmorphism Effect */}
          <CardHeader className="bg-gradient-to-r from-blue-600/90 to-indigo-700/90 p-4 border-b border-white/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9 border-2 border-white/30">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white font-semibold">
                    Banking Assistant
                  </CardTitle>
                  <p className="text-xs text-white/80">
                    {isTyping ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white/95 via-white/90 to-white/80">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[85%] gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback
                        className={`${
                          msg.role === "user"
                            ? "bg-indigo-600"
                            : "bg-blue-600"
                        } text-white`}
                      >
                        {msg.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/70"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%] gap-2">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-blue-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/70">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200/60 bg-white/80">
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about your account..."
                className="flex-1 bg-white/90 border-gray-300/80 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Cooperative Banking AI
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;

// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { MessageSquare, X } from "lucide-react";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: "user", content: input };
//     setMessages([...messages, userMessage]);
//     setInput("");

//     try {
//       const response = await axios.post("http://localhost:5000/chatbot", {
//         message: input,
//       });

//       console.log("Chatbot Response:", response.data.response);

//       const botMessage = { role: "bot", content: response.data.response };
//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 flex flex-col items-end">
//       {/* Chat Button */}
//       {!isOpen && (
//         <button
//           className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
//           onClick={() => setIsOpen(true)}
//         >
//           <MessageSquare size={24} />
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="bg-blue-500 text-white p-3 flex justify-between">
//             <span>Chatbot</span>
//             <button onClick={() => setIsOpen(false)}>
//               <X size={20} />
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-auto p-4 bg-gray-100">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-2 my-2 rounded-lg max-w-xs ${
//                   msg.role === "user"
//                     ? "bg-blue-500 text-white self-end"
//                     : "bg-gray-300 text-black self-start"
//                 }`}
//               >
//                 {msg.content}
//               </div>
//             ))}
//           </div>

//           {/* Input */}
//           <div className="flex p-2 bg-white border-t">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
//               placeholder="Type your message..."
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;
