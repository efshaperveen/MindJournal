import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare, FiX } from 'react-icons/fi';

const MindChatFloat = ({ entry, isOpen, setIsOpen, setEntry }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const initialMessage = entry
        ? `Let's talk about this entry: "${entry.title}". What's on your mind?`
        : "Hi there! I'm MindBot. How can I help you today?";
      setMessages([{ sender: 'bot', text: initialMessage }]);
    }
  }, [isOpen, entry]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const typingMessage = { sender: 'bot', text: 'MindBot is typing...' };
    setMessages(prev => [...prev, typingMessage]);

    const contextForApi = entry ? {
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      activities: entry.activities,
      micro_goals: entry.micro_goals,
    } : null;

    console.log('Sending to API with context:', contextForApi);

    try {
      const res = await fetch('https://mindjournal-backend-kygm.onrender.com/api/mindbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          context: contextForApi,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      if (!data.reply) {
        throw new Error('No reply in JSON');
      }

      setMessages(prev => [...prev.slice(0, -1), { sender: 'bot', text: data.reply }]);

    } catch (err) {
      console.error('Error:', err);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: 'Sorry, I had trouble responding 💙' }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClose = () => {
    setIsOpen(false);
    if (setEntry) {
      setEntry(null);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110"
          aria-label="Open MindBot"
        >
          <FiMessageSquare size={24} />
        </button>
      ) : (
        <div className="w-96 h-[60vh] flex flex-col bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">MindBot AI</h3>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <FiX size={20} className="text-neutral-600 dark:text-neutral-300" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line px-4 py-2 rounded-xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 flex items-center border-t border-neutral-200 dark:border-neutral-700">
            <input
              type="text"
              placeholder="Ask about your entry..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-full px-4 py-2 mr-2 outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleSend}
              className="p-3 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindChatFloat;
