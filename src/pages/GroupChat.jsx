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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white shadow-2xl rounded-2xl min-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white px-8 py-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Campus Discussion Forum</h1>
                <p className="text-primary-100 mt-2">Connected as {user.regNo}</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">
                <p className="text-sm">{messages.length} messages</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              parentMessages.map((msg) => (
                <div key={msg.id} className="animate-fade-in">
                  <div className={`flex ${msg.sender === user.regNo ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl ${msg.sender === user.regNo ? 'ml-auto' : ''}`}>
                      <div className={`rounded-2xl p-6 shadow-lg ${
                        msg.sender === user.regNo 
                          ? 'bg-gradient-to-r from-primary-700 to-primary-800 text-white'
                          : 'bg-white'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`font-semibold ${
                            msg.sender === user.regNo ? 'text-primary-100' : 'text-primary-700'
                          }`}>
                            {msg.sender}
                          </span>
                          <span className="text-sm opacity-70">{formatTime(msg.createdAt)}</span>
                        </div>
                        <p className="text-lg leading-relaxed">{msg.text}</p>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => setReplyTo(replyTo === msg.id ? null : msg.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            replyTo === msg.id
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-gray-100 text-primary-600 hover:bg-gray-200'
                          }`}
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
                              reply.sender === user.regNo 
                                ? 'bg-gradient-to-r from-primary-600/90 to-primary-700/90 text-white ml-auto'
                                : 'bg-white'
                            }`}>
                              <div className="flex justify-between items-start mb-2">
                                <span className={`font-medium ${
                                  reply.sender === user.regNo ? 'text-primary-100' : 'text-primary-700'
                                }`}>
                                  {reply.sender}
                                </span>
                                <span className="text-sm opacity-70">{formatTime(reply.createdAt)}</span>
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
                              className="flex-1 bg-white border border-gray-200 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                              type="submit"
                              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
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
            <div className="p-6 bg-white border-t border-gray-100 rounded-b-2xl">
              <form onSubmit={(e) => sendMessage(e)} className="animate-fade-in">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Start a new discussion..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3 font-medium"
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
