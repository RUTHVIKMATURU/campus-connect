import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

export default function GroupChat() {
  const [user, setUser] = useState({ regNo: '' });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect hook to check for login state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log(parsedUser.regNo)
      setUser({ regNo: parsedUser.regNo });
    } else {
      console.log('User not logged in!');
      // Optionally, redirect or show a login prompt here
    }

    // Fetch messages from Firestore
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
  }, []);  // Empty dependency array, only runs once on mount

  const loginUser = (regNo) => {
    if (regNo) {
      localStorage.setItem('user', JSON.stringify({ regNo }));
      setUser({ regNo });
    }
  };

  const sendMessage = async (e, parentId = null) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user.regNo) {
      console.log(user)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center px-4 py-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        <div className="bg-cyan-600 text-white text-lg font-semibold px-6 py-4 rounded-t-2xl">
          Campus Chat
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : (
            parentMessages.map((msg) => (
              <div key={msg.id} className="bg-cyan-50 p-4 rounded-xl shadow-sm">
                <div className="text-sm font-semibold text-cyan-800">
                  {msg.sender}
                </div>
                <div className="text-base text-gray-800 mt-1 break-words">{msg.text}</div>
                <button
                  onClick={() => setReplyTo(replyTo === msg.id ? null : msg.id)}
                  className="text-sm text-cyan-600 mt-2 hover:underline"
                >
                  {replyTo === msg.id ? 'Cancel' : 'Reply'}
                </button>

                <div className="pl-4 mt-3 space-y-2 border-l-2 border-cyan-200">
                  {getReplies(msg.id).map((reply) => (
                    <div key={reply.id} className="bg-white p-3 rounded-lg shadow">
                      <div className="text-sm font-semibold text-cyan-700">
                        {reply.sender}
                      </div>
                      <div className="text-sm text-gray-700">{reply.text}</div>
                    </div>
                  ))}

                  {replyTo === msg.id && (
                    <form onSubmit={(e) => sendMessage(e, msg.id)} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700"
                      >
                        Send
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {replyTo === null && (
          <form onSubmit={(e) => sendMessage(e)} className="flex gap-2 p-4 border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-700"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
