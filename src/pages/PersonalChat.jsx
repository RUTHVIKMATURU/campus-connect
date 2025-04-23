import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const PersonalChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [senior, setSenior] = useState(null);
  const [sending, setSending] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const { seniorId } = useParams();
  
  // Move these outside of component render
  const userRef = useRef(JSON.parse(localStorage.getItem('user')));
  const tokenRef = useRef(localStorage.getItem('token'));

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Separate effect for initial senior fetch
  useEffect(() => {
    if (!userRef.current || !tokenRef.current) {
      navigate('/login');
      return;
    }

    const fetchSenior = async () => {
      try {
        const seniorResponse = await axios.get(
          `http://localhost:5000/api/students/${seniorId}`,
          { 
            headers: { 
              'Authorization': `Bearer ${tokenRef.current}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        if (!seniorResponse.data) {
          throw new Error('Senior not found');
        }

        setSenior(seniorResponse.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchSenior();
  }, [seniorId, navigate]);

  // Separate effect for message polling
  useEffect(() => {
    if (!senior || !userRef.current || !tokenRef.current) return;

    const fetchMessages = async () => {
      try {
        const chatRoomId = [userRef.current.regNo, senior.regNo].sort().join('_');
        
        const messagesResponse = await axios.get(
          `http://localhost:5000/api/chat/${chatRoomId}`,
          { 
            headers: { 
              'Authorization': `Bearer ${tokenRef.current}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        setMessages(messagesResponse.data);
        setLoading(false);
        scrollToBottom();
      } catch (error) {
        handleError(error);
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up polling
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMessages();
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [senior?.regNo]);

  const handleError = (error) => {
    let errorMessage = 'An error occurred. ';
    
    if (!navigator.onLine) {
      errorMessage = 'No internet connection';
    } else if (error.response?.status === 401) {
      errorMessage = 'Session expired. Please login again';
      localStorage.clear();
      navigate('/login');
    } else if (error.response?.status === 404) {
      errorMessage = 'Senior not found';
    } else {
      errorMessage += error.response?.data?.message || error.message;
    }

    setError(errorMessage);
    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        {
          sender: userRef.current.regNo,
          receiver: senior.regNo,
          message: newMessage.trim()
        },
        { headers: { Authorization: `Bearer ${tokenRef.current}` } }
      );

      if (response.data.success) {
        setMessages(prev => [...prev, response.data.data]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-lg shadow-md">
        <h2 className="text-xl font-semibold">{senior?.name}</h2>
        <p className="text-sm opacity-75">
          {senior?.branch} • {senior?.year} Year
        </p>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === userRef.current.regNo ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === userRef.current.regNo
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.message}</p>
              <p className="text-xs mt-1 opacity-75">
                {format(new Date(message.createdAt), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            placeholder="Type your message..."
            disabled={sending}
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg bg-primary-600 text-white font-medium
              ${sending 
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary-700 active:bg-primary-800'
              }`}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalChat;







