import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import TopNavbar from './components/TopNavbar';
import GroupChat from './pages/GroupChat';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Seniors from './pages/Seniors';
import PersonalChat from './pages/PersonalChat';
import SeniorMessages from './pages/SeniorMessages';
import Experience from './pages/Experience';
import ExperienceDetail from './pages/ExperienceDetail';
import Profile from './pages/Profile';
import { motion, AnimatePresence } from 'framer-motion';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import AdminEvents from './pages/AdminEvents';
import { ThemeProvider } from './theme/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import AccessDenied from './components/AccessDenied';
import './theme/theme.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const isAdminStored = localStorage.getItem('isAdmin');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser._id) {
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    if (isAdminStored === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setUser(null);
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-300 dark:bg-dark bg-gray-50 text-gray-900 dark:text-dark-primary flex flex-col">
          <TopNavbar
            isLoggedIn={!!user}
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />

          <main className="flex-1 pt-16 min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/seniors" element={<Seniors />} />
                <Route path="/experiences" element={<Experience />} />
                <Route path="/experiences/:id" element={<ExperienceDetail />} />
                <Route path="/personal-chat/:seniorId" element={<PersonalChat />} />
                <Route path="/group-chat" element={<GroupChat user={user} />} />
                <Route path="/admin-login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                {/* Add the SeniorMessages route */}
                <Route
                  path="/senior-messages"
                  element={
                    user?.role === 'senior' ? (
                      <SeniorMessages />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
                <Route
                  path="/profile"
                  element={
                    user ? <Profile /> : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/events"
                  element={
                    user ? <Events /> : <AccessDenied message="You need to be logged in to view campus events." />
                  }
                />
                <Route
                  path="/events/:id"
                  element={
                    user ? <EventDetails /> : <AccessDenied message="You need to be logged in to view event details." />
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    isAdmin ? <AdminEvents /> : <Navigate to="/admin-login" replace />
                  }
                />
              </Routes>
            </div>
          </main>

          {/* Chatbot Button and Modal */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg dark:shadow-soft-dark z-50 transition-all"
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
                className="fixed bottom-20 right-6 w-[26rem] h-[32rem] bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl dark:shadow-soft-dark z-40 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-end items-center p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-light">
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-semibold"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                  <Chat />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

