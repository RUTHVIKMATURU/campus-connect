import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, LogIn, UserPlus, Shield, User, Calendar } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ isLoggedIn, isAdmin, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    if (isAdmin) {
      navigate('/admin-login');
    } else {
      navigate('/login');
    }
    // Call the onLogout prop to update parent state
    if (onLogout) {
      onLogout();
    }
  };

  const navLinkClasses = "flex items-center space-x-2 text-white hover:text-indigo-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300";
  const activeNavLinkClasses = "flex items-center space-x-2 text-white bg-white/20 font-medium px-3 py-2 rounded-lg";

  return (
    <nav className={`bg-gradient-to-r ${isDarkMode
      ? 'from-gray-900 via-indigo-900/40 to-gray-900'
      : 'from-indigo-800 via-indigo-700 to-indigo-800'
    } px-6 py-4 shadow-xl transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-indigo-200 transition-colors duration-300">
          Campus Connect
        </Link>

        <div className="flex items-center space-x-2">
          {isAdmin ? (
            // Admin navigation
            <>
              <Link
                to="/admin/events"
                className={navLinkClasses}
              >
                <Calendar size={20} />
                <span>Manage Events</span>
              </Link>
              <Link
                to="/admin-dashboard"
                className={navLinkClasses}
              >
                <Shield size={20} />
                <span>Dashboard</span>
              </Link>
              <div className="ml-2">
                <ThemeToggle />
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300 border border-white/5"
              >
                Logout from Admin
              </button>
            </>
          ) : user ? (
            // Regular user navigation
            <>
              <Link to="/" className={navLinkClasses}>
                Home
              </Link>

              {user.role === 'senior' ? (
                <>
                  <Link
                    to="/senior-messages"
                    className={navLinkClasses}
                  >
                    <MessageSquare size={20} />
                    <span>Messages from Juniors</span>
                  </Link>
                  <Link
                    to="/experiences"
                    className={navLinkClasses}
                  >
                    Experiences
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/seniors" className={navLinkClasses}>
                    Connect with Seniors
                  </Link>
                  <Link to="/experiences" className={navLinkClasses}>
                    Experiences
                  </Link>
                </>
              )}

              <Link to="/group-chat" className={navLinkClasses}>
                Group Chat
              </Link>

              <Link
                to="/events"
                className={navLinkClasses}
              >
                <Calendar size={20} />
                <span>Events</span>
              </Link>

              <Link
                to="/profile"
                className={navLinkClasses}
              >
                <User size={20} />
                <span>{user.regNo}</span>
              </Link>

              <div className="ml-2">
                <ThemeToggle />
              </div>

              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300 border border-white/5"
              >
                Logout
              </button>
            </>
          ) : (
            // Not logged in navigation
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className={navLinkClasses}
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className={navLinkClasses}
              >
                <UserPlus size={20} />
                <span>Register</span>
              </Link>

              <Link
                to="/admin-login"
                className={navLinkClasses}
              >
                <Shield size={20} />
                <span>Admin</span>
              </Link>

              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
