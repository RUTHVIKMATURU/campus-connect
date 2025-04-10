import { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';
import { askGemini } from '../gemini';

export default function Chat() {
  const [messages, setMessages] = useState([{ text: 'Hi there! 👋', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { text: trimmed, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const botReply = await askGemini(trimmed);

    setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl w-full h-full flex flex-col">
      <div className="bg-sky-700 text-white text-lg font-semibold py-3 px-5 rounded-t-2xl">
        💬 Chat with Gemini
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg max-w-xs rounded-bl-none animate-pulse">
              Gemini is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
          disabled={loading}
        />
        <button
          type="submit"
          className={`p-2 rounded-full ${
            loading ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 text-white'
          }`}
          disabled={loading}
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
}
