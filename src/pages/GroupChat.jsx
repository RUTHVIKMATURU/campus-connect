import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { MessageSquarePlus, Send, X } from 'lucide-react';

export default function GroupChat() {
  const [user, setUser] = useState({ regNo: '' });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ regNo: parsedUser.regNo });
    }

    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(allMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e, parentId = null) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user.regNo) {
      alert('You need to be logged in to send a message!');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        text: input,
        sender: user.regNo,
        createdAt: serverTimestamp(),
        parentId: parentId,
      });

      setInput('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again later.');
    }
  };

  const parentMessages = messages.filter((msg) => !msg.parentId);
  const getReplies = (parentId) => messages.filter((msg) => msg.parentId === parentId);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Campus Chat</h1>
            <p className="text-sm text-primary-100">Connected as {user.regNo}</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            parentMessages.map((msg) => (
              <div key={msg.id} 
                className={`animate-fade-in ${
                  msg.sender === user.regNo ? 'ml-auto' : ''
                }`}
              >
                <div className={`max-w-[80%] ${msg.sender === user.regNo ? 'ml-auto' : ''}`}>
                  <div className={`rounded-2xl p-4 shadow-md ${
                    msg.sender === user.regNo 
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                      : 'bg-gray-100'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-semibold ${
                        msg.sender === user.regNo ? 'text-primary-100' : 'text-primary-600'
                      }`}>
                        {msg.sender}
                      </span>
                      <span className="text-xs opacity-70">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="break-words">{msg.text}</p>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => setReplyTo(replyTo === msg.id ? null : msg.id)}
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      {replyTo === msg.id ? (
                        <>
                          <X size={16} /> Cancel Reply
                        </>
                      ) : (
                        <>
                          <MessageSquarePlus size={16} /> Reply
                        </>
                      )}
                    </button>
                  </div>

                  {/* Replies */}
                  <div className="pl-4 mt-3 space-y-3">
                    {getReplies(msg.id).map((reply) => (
                      <div key={reply.id} 
                        className={`animate-fade-in ${
                          reply.sender === user.regNo ? 'ml-auto' : ''
                        }`}
                      >
                        <div className={`rounded-xl p-3 shadow-sm max-w-[90%] ${
                          reply.sender === user.regNo 
                            ? 'bg-gradient-to-r from-primary-500/90 to-secondary-500/90 text-white ml-auto'
                            : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-sm font-medium ${
                              reply.sender === user.regNo ? 'text-primary-100' : 'text-primary-600'
                            }`}>
                              {reply.sender}
                            </span>
                            <span className="text-xs opacity-70">{formatTime(reply.createdAt)}</span>
                          </div>
                          <p className="text-sm">{reply.text}</p>
                        </div>
                      </div>
                    ))}

                    {replyTo === msg.id && (
                      <form onSubmit={(e) => sendMessage(e, msg.id)} 
                        className="flex gap-2 pt-2 animate-fade-in"
                      >
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-300"
                        >
                          <Send size={18} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Main Message Input */}
        {replyTo === null && (
          <form onSubmit={(e) => sendMessage(e)} 
            className="p-4 border-t border-gray-100 animate-fade-in"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Send size={18} />
                <span>Send</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
