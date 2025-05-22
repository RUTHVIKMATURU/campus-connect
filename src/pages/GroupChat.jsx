import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

import { MessageSquarePlus, Send, X, LogIn, RefreshCw } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function GroupChat() {
  const [user, setUser] = useState({ regNo: '' });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetrying, setAutoRetrying] = useState(false);

  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check JWT authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      setError('authentication_required');
    }
  }, []);

  // Define fetchMessages as a useCallback so it can be referenced in useEffect and other functions
  const fetchMessages = useCallback(async (isRetry = false) => {
    // Don't attempt to fetch if we're not authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setError('authentication_required');
      setLoading(false);
      return false;
    }

    try {
      if (isRetry) {
        console.log('Retrying connection to group chat...');
        setAutoRetrying(true);
      } else {
        console.log('Fetching group chat messages...');
      }

      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const fetchTimeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await axios.get('http://localhost:5000/api/chat/group/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(fetchTimeoutId);

        console.log('Group chat messages received:', response.data.length);

        // Format messages to match the expected structure
        const formattedMessages = response.data.map(msg => ({
          id: msg._id,
          text: msg.text,
          sender: msg.sender,
          createdAt: new Date(msg.createdAt),
          parentId: msg.parentId || null
        }));

        setMessages(formattedMessages);
        setLoading(false);
        setError(null); // Clear any previous errors
        setRetryCount(0); // Reset retry count on success
        setAutoRetrying(false);
        return true; // Success
      } catch (axiosError) {
        clearTimeout(fetchTimeoutId);
        throw axiosError;
      }
    } catch (error) {
      console.error('Error fetching group chat messages:', error);

      // Provide more specific error messages based on the error response
      let errorMessage = 'Error connecting to chat service. Please try again.';

      if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.';
      } else if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        errorMessage = 'Connection timed out. The server might not be running. Please make sure the backend server is started.';
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
          localStorage.removeItem('token'); // Clear invalid token
        } else if (error.response.status === 403) {
          errorMessage = 'You don\'t have permission to access the chat.';
        } else if (error.response.status === 404) {
          errorMessage = 'Chat service not found. The API endpoint might have changed or the server is not configured correctly.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Unable to reach the server. Please make sure the backend server is running at http://localhost:5000.';
      }

      setError(errorMessage);
      setLoading(false);
      setAutoRetrying(false);
      return false; // Failed
    }
  }, []);

  // Function to manually retry connection
  const retryConnection = useCallback(() => {
    setError(null);
    setLoading(true);
    setRetryCount(prev => prev + 1);
    fetchMessages(true);
  }, [fetchMessages]);

  // Main effect for loading messages and setting up polling
  useEffect(() => {
    // Set a timeout to handle cases where the server is completely unresponsive
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Connection timeout. The server might not be running. Please make sure the backend server is started.');

        // Schedule an automatic retry after timeout
        setTimeout(() => {
          if (retryCount < 3) { // Limit auto-retries to 3 attempts
            retryConnection();
          }
        }, 5000); // Wait 5 seconds before auto-retry
      }
    }, 8000); // Reduced to 8 seconds for faster feedback

    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      setError('authentication_required');
      setLoading(false);
      return; // Exit early if not authenticated
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser({ regNo: parsedUser.regNo });
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      setError('Error loading user data. Please try logging in again.');
      setLoading(false);
      return; // Exit early if there's an error
    }

    // Fetch messages initially
    fetchMessages();

    // Set up polling for new messages
    pollIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible' && !loading && !error) {
        fetchMessages();
      }
    }, 10000); // Poll every 10 seconds

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchMessages, loading, error, retryCount, retryConnection]);

  const sendMessage = async (e, parentId = null) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user.regNo) {
      setError('authentication_required');
      return;
    }

    // Check if user is still authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setError('authentication_required');
      return;
    }

    // Create a temporary message ID to show optimistic UI update
    const tempId = 'temp-' + Date.now();
    const tempMessage = {
      id: tempId,
      text: input,
      sender: user.regNo,
      createdAt: new Date(), // Use current date as temporary timestamp
      parentId: parentId,
      pending: true // Mark as pending
    };

    // Store the message text before clearing the input
    const messageTxt = input;

    // Clear input and reset reply state immediately for better UX
    setInput('');
    if (parentId) setReplyTo(null);

    // Optimistically add the message to the UI
    setMessages(prev => [...prev, tempMessage]);

    // Send message to the server
    try {
      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await axios.post('http://localhost:5000/api/chat/group/message', {
          sender: user.regNo,
          text: messageTxt,
          parentId: parentId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('Message sent successfully:', response.data);

        // After successful send, refresh all messages to ensure consistency
        fetchMessages();

        // But also update the temporary message immediately for better UX
        if (response.data.success && response.data.data) {
          const newMessage = {
            id: response.data.data._id,
            text: response.data.data.text,
            sender: response.data.data.sender,
            createdAt: new Date(response.data.data.createdAt),
            parentId: response.data.data.parentId || null
          };

          setMessages(prev => prev.map(msg =>
            msg.id === tempId ? newMessage : msg
          ));
        }
      } catch (axiosError) {
        clearTimeout(timeoutId);
        throw axiosError;
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Show error message but keep it brief
      let errorMessage = 'Failed to send message. Please try again.';

      if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.';
      } else if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        errorMessage = 'Connection timed out. The server might not be running. Please make sure the backend server is started.';
      } else if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          setError('authentication_required');

          // Remove the optimistic message
          setMessages(prev => prev.filter(msg => msg.id !== tempId));

          // If it was a reply, restore the reply state
          if (parentId) setReplyTo(parentId);
          return;
        } else if (error.response.status === 404) {
          errorMessage = 'Chat service not found. The API endpoint might have changed or the server is not configured correctly.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to reach the server. Please make sure the backend server is running at http://localhost:5000.';
      }

      setError(errorMessage);

      // Remove the optimistic message if it failed
      setMessages(prev => prev.filter(msg => msg.id !== tempId));

      // If it was a reply, restore the reply state
      if (parentId) setReplyTo(parentId);
    }
  };

  const parentMessages = messages.filter((msg) => !msg.parentId);
  const getReplies = (parentId) => messages.filter((msg) => msg.parentId === parentId);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      // Handle both Date objects and strings
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 shadow-2xl dark:shadow-gray-900/30 rounded-2xl min-h-[85vh] flex flex-col border border-gray-100 dark:border-gray-700 transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-800 dark:from-gray-900 dark:via-indigo-900/40 dark:to-gray-900 text-white px-8 py-6 rounded-t-2xl transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Campus Discussion Forum</h1>
                <p className="text-indigo-200 dark:text-indigo-300 mt-2">Connected as {user.regNo}</p>
              </div>
              <div className="bg-white/10 dark:bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <p className="text-sm">{messages.length} messages</p>
              </div>
            </div>

            {/* Error notification banner that doesn't block the UI */}
            {error && messages.length > 0 && (
              <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3 flex justify-between items-center">
                <p className="text-sm text-red-100">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-200 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Connecting to chat...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full">
                {error === 'authentication_required' ? (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 p-6 rounded-xl max-w-md text-center border border-indigo-100 dark:border-indigo-800/30">
                    <p className="mb-4">You need to be logged in to use the chat.</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                      <LogIn size={18} />
                      Log In
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl max-w-md text-center border border-red-100 dark:border-red-800/30">
                    <p className="mb-4">{error}</p>
                    {autoRetrying ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2">
                          <RefreshCw size={18} className="animate-spin" />
                          <span>Attempting to reconnect...</span>
                        </div>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                        >
                          Refresh Page
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={retryConnection}
                          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 flex items-center gap-2"
                        >
                          <RefreshCw size={16} />
                          Try Again
                        </button>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                        >
                          Refresh Page
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-xl max-w-md border border-indigo-100 dark:border-indigo-800/30">
                  <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">No messages yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Be the first to start a conversation!</p>
                </div>
              </div>
            ) : (
              parentMessages.map((msg) => (
                <div key={msg.id} className="animate-fade-in">
                  <div className={`flex ${msg.sender === user.regNo ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${msg.sender === user.regNo ? 'ml-auto' : ''}`}>
                      <div className={`rounded-2xl p-6 shadow-lg ${
                        msg.pending
                          ? 'bg-gradient-to-r from-indigo-400 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 text-white opacity-70'
                          : msg.sender === user.regNo
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white'
                            : 'bg-white dark:bg-gray-700 dark:text-white'
                      } transition-all duration-300`}>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`font-semibold ${
                            msg.sender === user.regNo ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-300'
                          }`}>
                            {msg.sender}
                          </span>
                          <div className="flex items-center">
                            {msg.pending && (
                              <span className="text-xs mr-2 text-indigo-200 dark:text-indigo-300">Sending...</span>
                            )}
                            <span className="text-sm opacity-70">{formatTime(msg.createdAt)}</span>
                          </div>
                        </div>
                        <p className="text-lg leading-relaxed">{msg.text}</p>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => setReplyTo(replyTo === msg.id ? null : msg.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            replyTo === msg.id
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                              : 'bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          } border border-transparent dark:border-gray-600 transition-all duration-300`}
                        >
                          {replyTo === msg.id ? (
                            <>
                              <X size={18} /> Cancel Reply
                            </>
                          ) : (
                            <>
                              <MessageSquarePlus size={18} /> Reply
                            </>
                          )}
                        </button>
                      </div>

                      {/* Replies */}
                      <div className="pl-8 mt-4 space-y-4">
                        {getReplies(msg.id).map((reply) => (
                          <div key={reply.id}
                            className={`animate-fade-in flex ${
                              reply.sender === user.regNo ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className={`rounded-xl p-4 shadow-md max-w-xl ${
                              reply.pending
                                ? 'bg-gradient-to-r from-indigo-400/90 to-indigo-500/90 dark:from-indigo-500/90 dark:to-indigo-600/90 text-white ml-auto opacity-70'
                                : reply.sender === user.regNo
                                  ? 'bg-gradient-to-r from-indigo-500/90 to-indigo-600/90 dark:from-indigo-600/90 dark:to-indigo-700/90 text-white ml-auto'
                                  : 'bg-white dark:bg-gray-700 dark:text-white'
                            } transition-all duration-300`}>
                              <div className="flex justify-between items-start mb-2">
                                <span className={`font-medium ${
                                  reply.sender === user.regNo ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-300'
                                }`}>
                                  {reply.sender}
                                </span>
                                <div className="flex items-center">
                                  {reply.pending && (
                                    <span className="text-xs mr-2 text-indigo-200 dark:text-indigo-300">Sending...</span>
                                  )}
                                  <span className="text-sm opacity-70">{formatTime(reply.createdAt)}</span>
                                </div>
                              </div>
                              <p className="text-base">{reply.text}</p>
                            </div>
                          </div>
                        ))}

                        {replyTo === msg.id && (
                          <form onSubmit={(e) => sendMessage(e, msg.id)}
                            className="flex gap-3 pt-3 animate-fade-in"
                          >
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white transition-colors duration-300"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                              type="submit"
                              className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white px-6 py-3 rounded-xl hover:shadow-lg dark:shadow-indigo-900/30 transition-all duration-300"
                            >
                              <Send size={20} />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Main Message Input */}
          {replyTo === null && (
            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-2xl transition-colors duration-300">
              <form onSubmit={(e) => sendMessage(e)} className="animate-fade-in">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Start a new discussion..."
                    className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent text-lg text-gray-900 dark:text-white transition-colors duration-300"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 text-white px-8 py-4 rounded-xl hover:shadow-lg dark:shadow-indigo-900/30 transition-all duration-300 flex items-center gap-3 font-medium"
                  >
                    <Send size={20} />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
