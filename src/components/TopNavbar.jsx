import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  LogIn,
  UserPlus,
  Shield,
  User,
  Calendar,
  Home,
  Menu,
  X,
  BookOpen,
  Users,
  LogOut,
  ChevronDown,
  Settings,
  Bell,
  HelpCircle,
  GraduationCap,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNavbar({ isLoggedIn, isAdmin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleDropdown = (key, e) => {
    e?.stopPropagation();
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinkClasses = "flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 w-full";
  const activeNavLinkClasses = "flex items-center space-x-3 text-indigo-600 dark:text-indigo-400 font-medium py-3 px-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 w-full";

  const mobileNavLinkClasses = "block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200";
  const mobileActiveNavLinkClasses = "block w-full text-left px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400";

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  CC
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Campus Connect
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Removed as requested, since these links are in the menu */}
            <div className="flex-1"></div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* User Profile or Login */}
              {user || isAdmin ? (
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown('profile', e)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {isAdmin ? (
                        <Shield size={16} className="text-indigo-600 dark:text-indigo-400" />
                      ) : user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name || user.regNo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={16} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openDropdowns.profile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                      >
                        {isAdmin ? (
                          <>
                            <Link
                              to="/admin-dashboard"
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setOpenDropdowns({})}
                            >
                              Admin Dashboard
                            </Link>
                            <Link
                              to="/admin/events"
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setOpenDropdowns({})}
                            >
                              Manage Events
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setOpenDropdowns({})}
                          >
                            Your Profile
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Sign in
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30"
              onClick={closeMenu}
            />

            {/* Mobile menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 z-40 shadow-xl overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
                <div className="flex items-center space-x-2">
                  {/* Theme Toggle in Mobile Menu */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label="Toggle dark mode"
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <nav className="mt-4">
                {isAdmin ? (
                  // Admin mobile navigation
                  <div className="px-2 space-y-1">
                    <Link
                      to="/admin/events"
                      className={isActive('/admin/events') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Manage Events
                    </Link>
                    <Link
                      to="/admin-dashboard"
                      className={isActive('/admin-dashboard') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                ) : user ? (
                  // Regular user mobile navigation
                  <div className="px-2 space-y-1">
                    <Link
                      to="/"
                      className={isActive('/') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Home
                    </Link>

                    {user.role === 'senior' ? (
                      <>
                        <Link
                          to="/senior-messages"
                          className={isActive('/senior-messages') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                          onClick={closeMenu}
                        >
                          Messages from Juniors
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/seniors"
                        className={isActive('/seniors') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                        onClick={closeMenu}
                      >
                        Connect with Seniors
                      </Link>
                    )}

                    <Link
                      to="/experiences"
                      className={isActive('/experiences') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Experiences
                    </Link>

                    <Link
                      to="/group-chat"
                      className={isActive('/group-chat') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Group Chat
                    </Link>

                    <Link
                      to="/events"
                      className={isActive('/events') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Events
                    </Link>

                    <Link
                      to="/profile"
                      className={isActive('/profile') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  // Not logged in mobile navigation
                  <div className="px-2 space-y-1">
                    <Link
                      to="/login"
                      className={isActive('/login') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={isActive('/register') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Register
                    </Link>
                    <Link
                      to="/admin-login"
                      className={isActive('/admin-login') ? mobileActiveNavLinkClasses : mobileNavLinkClasses}
                      onClick={closeMenu}
                    >
                      Admin
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
