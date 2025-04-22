import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Bot } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Experience from './pages/Experience';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import GroupChat from './pages/GroupChat';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Placement from './pages/Placement';
import Seniors from './pages/Seniors';
import PersonalChat from './pages/PersonalChat';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const adminFlag = localStorage.getItem('isAdmin');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (adminFlag === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 text-gray-800 transition-all duration-300">
        <Navbar isLoggedIn={!!user || isAdmin} onLogout={handleLogout} isAdmin={isAdmin} />

        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/placements" element={<Placement />} />
            <Route path="/events" element={<Events isAdmin={isAdmin} />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/group-chat" element={<GroupChat user={user} />} />
            <Route path="/admin-login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
            <Route
              path="/admin-dashboard"
              element={isAdmin ? <AdminDashboard /> : <AdminLogin setIsAdmin={setIsAdmin} />}
            />
            <Route path="/seniors" element={<Seniors />} />
            <Route path="/personal-chat/:seniorId" element={<PersonalChat />} />
          </Routes>
        </main>

        {/* Chatbot Floating Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-full shadow-lg z-50 transition-all"
          title="Chat with Gemini"
        >
          <Bot size={24} />
        </button>

        <AnimatePresence>
        {showChat && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-[26rem] h-[32rem] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Close Button */}
            <div className="flex justify-end items-center p-2 border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
              <Chat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      </div>
    </Router>
  );
}

export default App;


