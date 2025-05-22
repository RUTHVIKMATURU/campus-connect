import { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';
import { askGemini } from '../gemini';
import { useTheme } from '../theme/ThemeContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Chat() {
  const [messages, setMessages] = useState([{ text: 'Hi, How can I help you', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useTheme();

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
    <div className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/30 rounded-2xl w-full h-full flex flex-col transition-colors duration-300">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-800 dark:to-indigo-900 text-white text-lg font-semibold py-3 px-5 rounded-t-2xl transition-colors duration-300">
        💬 Chat with Arya
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 dark:bg-gray-800 transition-colors duration-300">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 dark:bg-indigo-700 text-white rounded-br-none max-w-xs'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none max-w-[80%] md:max-w-[70%]'
              } transition-colors duration-300`}
            >
              {msg.sender === 'user' ? (
                <div className="prose-sm break-words">{msg.text}</div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Customize heading styles
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-2 mb-1" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold mt-2 mb-1" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,

                      // Customize paragraph styles
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,

                      // Customize list styles
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,

                      // Customize code styles
                      code: ({node, inline, ...props}) =>
                        inline
                          ? <code className="bg-gray-100 dark:bg-gray-600 px-1 py-0.5 rounded text-xs" {...props} />
                          : <code className="block bg-gray-100 dark:bg-gray-600 p-2 rounded text-xs overflow-x-auto my-2" {...props} />,

                      // Customize link styles
                      a: ({node, ...props}) => <a className="text-indigo-600 dark:text-indigo-400 underline" {...props} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-lg max-w-xs rounded-bl-none animate-pulse transition-colors duration-300">
              Arya is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-colors duration-300"
          disabled={loading}
        />
        <button
          type="submit"
          className={`p-2 rounded-full transition-colors duration-300 ${
            loading
              ? 'bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white'
          }`}
          disabled={loading}
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
}
