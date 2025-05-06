import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useTheme } from '../theme/ThemeContext';

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
  const { isDarkMode } = useTheme();

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
        console.log('Fetching senior with ID:', seniorId);
        console.log('Using token:', tokenRef.current ? 'Token exists' : 'No token');

        const seniorResponse = await axios.get(
          `http://localhost:5000/api/students/${seniorId}`,
          {
            headers: {
              'Authorization': `Bearer ${tokenRef.current}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Senior response:', seniorResponse);

        if (!seniorResponse.data) {
          console.error('No data received for senior');
          throw new Error('Senior not found');
        }

        console.log('Senior data:', seniorResponse.data);
        setSenior(seniorResponse.data);
      } catch (error) {
        console.error('Error fetching senior:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
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
      console.log('404 error - Senior not found. ID:', seniorId);
    } else {
      errorMessage += error.response?.data?.message || error.message;
    }

    console.log('Setting error message:', errorMessage);
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
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700 max-w-md w-full">
          <div className="text-red-600 dark:text-red-400 text-center">
            <p className="text-xl font-semibold">Error</p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 dark:from-indigo-800 dark:to-indigo-700 text-white p-5 rounded-t-lg shadow-md">
        <h2 className="text-xl font-semibold">{senior?.name}</h2>
        <p className="text-sm opacity-75">
          {senior?.branch} • {senior?.year} Year
        </p>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 space-y-4 transition-colors duration-300"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === userRef.current.regNo ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-4 shadow-md ${
                message.sender === userRef.current.regNo
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-600'
              } transition-all duration-300`}
            >
              <p>{message.message}</p>
              <p className={`text-xs mt-2 ${
                message.sender === userRef.current.regNo
                  ? 'text-indigo-200 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {format(new Date(message.createdAt), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="mt-4 bg-white dark:bg-gray-700 p-4 rounded-b-lg border-t border-gray-100 dark:border-gray-600 transition-colors duration-300">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
            placeholder="Type your message..."
            disabled={sending}
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium shadow-md dark:shadow-indigo-900/30
              ${sending
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 dark:active:bg-indigo-700'
              } transition-all duration-300`}
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







