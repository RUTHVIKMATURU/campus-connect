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

        {/* Floating Chat Window */}
        {showChat && (
          <div className="fixed bottom-20 right-6 w-80 h-[28rem] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200">
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
              <Chat />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
