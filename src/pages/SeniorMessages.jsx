import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

export default function SeniorMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
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
        const response = await axios.get(
          `http://localhost:5000/api/chat/senior-messages/${userRef.current.regNo}`,
          {
            headers: { 'Authorization': `Bearer ${tokenRef.current}` }
          }
        );

        if (response.data && Array.isArray(response.data)) {
          // Sort conversations by most recent message
          const sortedConversations = response.data
            .filter(conv => conv.messages.length > 0) // Only show conversations with messages
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

          setConversations(sortedConversations);
          
          // If there's no selected conversation and we have conversations,
          // select the most recent one
          if (!selectedConversation && sortedConversations.length > 0) {
            setSelectedConversation(sortedConversations[0]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages from Students</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Conversations ({conversations.length})
          </h2>
          {conversations.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <p>No messages yet</p>
              <p className="text-sm mt-2">When students message you, they'll appear here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.student._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedConversation?.student._id === conv.student._id
                      ? 'bg-primary-100 border-l-4 border-primary-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{conv.student.name}</div>
                  <div className="text-sm text-gray-600">
                    {conv.student.branch} - {conv.student.year} Year
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Last message: {format(new Date(conv.messages[0].createdAt), 'MMM d, h:mm a')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages View */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4 h-[80vh] flex flex-col">
          {selectedConversation ? (
            <>
              <div className="mb-4 border-b pb-3">
                <h2 className="text-lg font-semibold">
                  Chat with {selectedConversation.student.name}
                </h2>
                <p className="text-sm text-gray-600">
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
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === selectedConversation.student.regNo
                          ? 'bg-gray-100'
                          : 'bg-primary-600 text-white'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendReply} className="flex gap-2 p-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-primary-600"
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-xl mb-2">Select a conversation to view messages</p>
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





