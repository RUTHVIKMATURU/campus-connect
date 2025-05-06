import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useTheme } from '../theme/ThemeContext';

export default function SeniorMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Use refs for stable values
  const userRef = useRef(JSON.parse(localStorage.getItem('user')));
  const tokenRef = useRef(localStorage.getItem('token'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!userRef.current || !tokenRef.current) {
      navigate('/login');
      return;
    }

    if (userRef.current.role !== 'senior') {
      navigate('/');
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log('Fetching messages for senior:', userRef.current.regNo);
        console.log('Using token:', tokenRef.current ? 'Token exists' : 'No token');

        // Check if we have a valid token
        if (!tokenRef.current) {
          throw new Error('No authentication token available');
        }

        try {
          const response = await axios.get(
            `http://localhost:5000/api/chat/senior-messages/${userRef.current.regNo}`,
            {
              headers: { 'Authorization': `Bearer ${tokenRef.current}` }
            }
          );

          console.log('Response received:', response);

          if (!response.data) {
            throw new Error('No data received from server');
          }

          if (!Array.isArray(response.data)) {
            console.error('Expected array but got:', typeof response.data);
            throw new Error('Invalid response format');
          }

          console.log('Conversations received:', response.data.length);

          // Sort conversations by most recent message
          const sortedConversations = response.data
            .filter(conv => conv.messages && conv.messages.length > 0) // Only show conversations with messages
            .map(conv => ({
              ...conv,
              messages: conv.messages.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
              )
            }))
            .sort((a, b) => {
              const aLatest = new Date(a.messages[0]?.createdAt || 0);
              const bLatest = new Date(b.messages[0]?.createdAt || 0);
              return bLatest - aLatest;
            });

          console.log('Sorted conversations:', sortedConversations.length);
          setConversations(sortedConversations);

          // If there's no selected conversation and we have conversations,
          // select the most recent one
          if (!selectedConversation && sortedConversations.length > 0) {
            setSelectedConversation(sortedConversations[0]);
          }

          setLoading(false);
        } catch (axiosError) {
          console.error('Axios error:', axiosError);
          console.error('Error details:', {
            message: axiosError.message,
            response: axiosError.response,
            status: axiosError.response?.status,
            data: axiosError.response?.data
          });
          throw new Error(axiosError.response?.data?.message || axiosError.message || 'Failed to fetch messages from server');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error.message || 'Failed to load messages from juniors');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up polling with visibility check
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMessages();
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/chat', {
        sender: userRef.current.regNo,
        receiver: selectedConversation.student.regNo,
        message: reply.trim()
      }, {
        headers: { 'Authorization': `Bearer ${tokenRef.current}` }
      });

      setReply('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700 max-w-md w-full">
          <div className="text-red-600 dark:text-red-400 text-center">
            <p className="text-xl font-semibold mb-2">{error}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Unable to load your messages</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Messages from Students</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-5 border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Conversations ({conversations.length})
          </h2>
          {conversations.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600/30">
              <p className="font-medium">No messages yet</p>
              <p className="text-sm mt-2">When students message you, they'll appear here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {conversations.map((conv) => (
                <button
                  key={conv.student._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    selectedConversation?.student._id === conv.student._id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 dark:border-indigo-500 shadow-sm'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{conv.student.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {conv.student.branch} - {conv.student.year} Year
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Last message: {format(new Date(conv.messages[0].createdAt), 'MMM d, h:mm a')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages View */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-5 h-[80vh] flex flex-col border border-gray-100 dark:border-gray-700 transition-all duration-300">
          {selectedConversation ? (
            <>
              <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Chat with {selectedConversation.student.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedConversation.student.branch} - {selectedConversation.student.year} Year
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">
                {selectedConversation.messages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`flex ${msg.sender === selectedConversation.student.regNo ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 shadow-md ${
                        msg.sender === selectedConversation.student.regNo
                          ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-600'
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white'
                      } transition-all duration-300`}
                    >
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-2 ${
                        msg.sender === selectedConversation.student.regNo
                          ? 'text-gray-500 dark:text-gray-400'
                          : 'text-indigo-200 dark:text-indigo-300'
                      }`}>
                        {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendReply} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md dark:shadow-indigo-900/30 transition-all duration-300"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center bg-gray-50 dark:bg-gray-700/30 p-8 rounded-xl border border-gray-100 dark:border-gray-600/30 max-w-md">
                <p className="text-xl mb-3 font-medium text-gray-700 dark:text-gray-300">Select a conversation to view messages</p>
                {conversations.length === 0 && (
                  <p className="text-sm">When students message you, their conversations will appear here</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





