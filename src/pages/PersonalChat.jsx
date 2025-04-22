import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Send } from 'lucide-react';

export default function PersonalChat() {
  const { seniorId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [senior, setSenior] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(storedUser);

    const fetchSenior = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students/${seniorId}`);
        setSenior(response.data);
      } catch (error) {
        console.error('Error fetching senior details:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const chatRoomId = [storedUser.regNo, seniorId].sort().join('_');
        const response = await axios.get(`http://localhost:5000/api/chat/${chatRoomId}`);
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchSenior();
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [seniorId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/chat', {
        sender: currentUser.regNo,
        receiver: seniorId,
        message: input.trim()
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary-600 text-white p-4">
        <h2 className="text-xl font-semibold">
          {senior ? senior.name : 'Loading...'}
        </h2>
      </div>

      {/* Messages Area */}
      <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === currentUser?.regNo ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === currentUser?.regNo
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-primary-600"
          />
          <button
            type="submit"
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}


