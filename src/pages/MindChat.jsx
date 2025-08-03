import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

function MindChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi shining star 🌻, I am MindBot-AI.\nHow are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Typing placeholder
    const typingMessage = { sender: "bot", text: "MindBot is typing..." };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const res = await fetch(
        "https://mindjournal-backend-kygm.onrender.com/api/mindbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input.trim() }),
        }
      );

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      if (!data.reply) {
        throw new Error("No reply in JSON");
      }

      // Replace typing with real reply
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: data.reply },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "Sorry, I had trouble responding 💙" },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
 calendar-ui-fix
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto mt-8 rounded-xl shadow-lg bg-[#1e1e1e] border border-[#2c2c2c] overflow-hidden">
      <div className="p-4 text-lg font-semibold text-teal-400 border-b border-[#2c2c2c]">
         <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">MindBot-AI Chat</span>
  </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
 calendar-ui-fix
              className={`max-w-[80%] whitespace-pre-line px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                msg.sender === 'user'
                  ? 'bg-teal-500 text-white hover:brightness-110'
                  : 'bg-[#2c2c2c] text-gray-200 border border-[#3a3a3a] hover:bg-[#333333]'

              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 flex items-center border-t border-[#2c2c2c] bg-[#1e1e1e]">
        <input
          type="text"
          placeholder="Type how you feel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
 calendar-ui-fix
          onKeyPress={handleKeyPress}
          className="flex-1 bg-[#2c2c2c] text-gray-200 placeholder-gray-500 rounded-full px-4 py-2 mr-2 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"

        />
        <button
          onClick={handleSend}
          className="p-3 bg-teal-500 rounded-full text-white hover:bg-teal-600 active:scale-95 transition-all duration-200 shadow-md hover:shadow-teal-500/50"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}

export default MindChat;
