import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_PROMPT = `You are Aara, the official AI Assistant for AARA INFRA, a premium infrastructure development and consultancy company. 
You are here to assist clients with their infrastructure needs, answer questions about our products, and guide them through our digital dashboard. 
Keep your answers professional, concise, and helpful. Use a warm, premium tone.

Products we sell include premium uPVC and Aluminum fixtures:
- Sliding Windows
- Casement Windows
- Fixed Glass Windows
- French Windows
- Tilt & Turn Windows
- Ventilator Windows
- Acoustic Soundproof Windows
- Bay Windows
- Thermal Break Aluminum Windows
- Skylight Windows
- Louvered Windows
- Awning Windows

We emphasize smart infrastructure management, transparent billing, and premium end-to-end service. Do not write extremely long messages. Use bullet points where appropriate for readability.`;

export default function ClientChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Aara, your personal infrastructure assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
        userMessage
      ].map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!res.ok) {
        throw new Error('Failed to connect to AI');
      }

      const data = await res.json();
      const botResponse = data.choices[0].message.content;

      setMessages((prev) => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all ${isOpen ? 'pointer-events-none' : ''}`}
        aria-label="Open Chat"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Aara AI</h3>
                  <p className="text-primary-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-gray-950/50">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      msg.role === 'user' 
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                        : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-sm'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    {/* Bubble */}
                    <div className={`p-3.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%] flex-row">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-sm flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200 text-sm transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2">
                Aara AI can make mistakes. Consider verifying important information.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
