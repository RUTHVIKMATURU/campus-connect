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
  ChevronRight,
  ChevronDown,
  Settings,
  Bell,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isLoggedIn, isAdmin, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClasses = "flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 w-full";
  const activeNavLinkClasses = "flex items-center space-x-3 text-indigo-600 dark:text-indigo-400 font-medium py-3 px-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 w-full";

  const sidebarVariants = {
    open: { width: '280px', transition: { duration: 0.3 } },
    closed: { width: '80px', transition: { duration: 0.3 } }
  };

  const logoVariants = {
    open: { opacity: 1, display: 'block', transition: { delay: 0.2, duration: 0.2 } },
    closed: { opacity: 0, display: 'none', transition: { duration: 0.2 } }
  };

  const textVariants = {
    open: { opacity: 1, display: 'block', transition: { delay: 0.2, duration: 0.2 } },
    closed: { opacity: 0, display: 'none', transition: { duration: 0.1 } }
  };

  return (
    <>
      {/* Mobile menu toggle button - visible on small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile - only visible when sidebar is open on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="open"
        animate={isOpen ? "open" : "closed"}
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/30 z-40 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden ${isOpen ? 'w-72' : 'w-20'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
              CC
            </div>
            <motion.span
              variants={logoVariants}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Campus Connect
            </motion.span>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:block"
          >
            <ChevronRight size={20} className={`transform transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* User Profile Section - Always Visible */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/profile" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name || user.regNo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-gray-500 dark:text-gray-400" />
                )}
              </div>
              <motion.div variants={textVariants} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name || user.regNo}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.role === 'senior' ? 'Senior Student' : 'Student'}
                </p>
              </motion.div>
            </Link>
          </div>
        )}

        {/* Menu Toggle Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleMenu}
            className={`${navLinkClasses} justify-between w-full`}
          >
            <div className="flex items-center">
              <Menu size={20} />
              <motion.span variants={textVariants} className="ml-3">Menu</motion.span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Sidebar Content - Only visible when menu is open */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4 flex flex-col overflow-hidden"
            >
              <div className="space-y-1 px-3">
            {isAdmin ? (
              // Admin navigation
              <>
                <div className="mb-2">
                  <button
                    onClick={() => toggleDropdown('adminEvents')}
                    className={`${navLinkClasses} justify-between`}
                  >
                    <div className="flex items-center">
                      <Calendar size={20} />
                      <motion.span variants={textVariants} className="ml-3">Events</motion.span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${openDropdowns.adminEvents ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdowns.adminEvents && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-8"
                      >
                        <Link
                          to="/admin/events"
                          className={`${isActive('/admin/events') ? activeNavLinkClasses : navLinkClasses} py-2`}
                        >
                          <motion.span variants={textVariants}>Manage Events</motion.span>
                        </Link>
                        <Link
                          to="/admin/events/create"
                          className={`${isActive('/admin/events/create') ? activeNavLinkClasses : navLinkClasses} py-2`}
                        >
                          <motion.span variants={textVariants}>Create Event</motion.span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mb-2">
                  <button
                    onClick={() => toggleDropdown('adminUsers')}
                    className={`${navLinkClasses} justify-between`}
                  >
                    <div className="flex items-center">
                      <Users size={20} />
                      <motion.span variants={textVariants} className="ml-3">Users</motion.span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${openDropdowns.adminUsers ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdowns.adminUsers && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-8"
                      >
                        <Link
                          to="/admin-dashboard"
                          className={`${isActive('/admin-dashboard') ? activeNavLinkClasses : navLinkClasses} py-2`}
                        >
                          <motion.span variants={textVariants}>All Users</motion.span>
                        </Link>
                        <Link
                          to="/admin/seniors"
                          className={`${isActive('/admin/seniors') ? activeNavLinkClasses : navLinkClasses} py-2`}
                        >
                          <motion.span variants={textVariants}>Seniors</motion.span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/admin/settings"
                  className={isActive('/admin/settings') ? activeNavLinkClasses : navLinkClasses}
                >
                  <Settings size={20} />
                  <motion.span variants={textVariants}>Settings</motion.span>
                </Link>
              </>
            ) : user ? (
              // Regular user navigation
              <>
                <Link
                  to="/"
                  className={isActive('/') ? activeNavLinkClasses : navLinkClasses}
                >
                  <Home size={20} />
                  <motion.span variants={textVariants}>Home</motion.span>
                </Link>

                {user.role === 'senior' ? (
                  // Senior navigation
                  <>
                    <div className="mb-2">
                      <button
                        onClick={() => toggleDropdown('messages')}
                        className={`${navLinkClasses} justify-between`}
                      >
                        <div className="flex items-center">
                          <MessageSquare size={20} />
                          <motion.span variants={textVariants} className="ml-3">Messages</motion.span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${openDropdowns.messages ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdowns.messages && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-8"
                          >
                            <Link
                              to="/senior-messages"
                              className={`${isActive('/senior-messages') ? activeNavLinkClasses : navLinkClasses} py-2`}
                            >
                              <motion.span variants={textVariants}>Junior Messages</motion.span>
                            </Link>
                            <Link
                              to="/group-chat"
                              className={`${isActive('/group-chat') ? activeNavLinkClasses : navLinkClasses} py-2`}
                            >
                              <motion.span variants={textVariants}>Group Chat</motion.span>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mb-2">
                      <button
                        onClick={() => toggleDropdown('experiences')}
                        className={`${navLinkClasses} justify-between`}
                      >
                        <div className="flex items-center">
                          <BookOpen size={20} />
                          <motion.span variants={textVariants} className="ml-3">Experiences</motion.span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${openDropdowns.experiences ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdowns.experiences && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-8"
                          >
                            <Link
                              to="/experiences"
                              className={`${isActive('/experiences') ? activeNavLinkClasses : navLinkClasses} py-2`}
                            >
                              <motion.span variants={textVariants}>Browse All</motion.span>
                            </Link>
                            <Link
                              to="/experiences/create"
                              className={`${isActive('/experiences/create') ? activeNavLinkClasses : navLinkClasses} py-2`}
                            >
                              <motion.span variants={textVariants}>Share Experience</motion.span>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  // Student navigation
                  <>
                    <div className="mb-2">
                      <button
                        onClick={() => toggleDropdown('connect')}
                        className={`${navLinkClasses} justify-between`}
                      >
                        <div className="flex items-center">
                          <Users size={20} />
                          <motion.span variants={textVariants} className="ml-3">Connect</motion.span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${openDropdowns.connect ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdowns.connect && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-8"
                          >
                            <Link
                              to="/seniors"
                              className={`${isActive('/seniors') ? activeNavLinkClasses : navLinkClasses} py-2`}
                            >
                              <motion.span variants={textVariants}>Find Seniors</motion.span>
                            </Link>
                            <Link
                              to="/group-chat"
                              className={`${isActive('/group-chat') ? activeNavLinkClasses : navLinkClasses} py-2`}
                            >
                              <motion.span variants={textVariants}>Group Chat</motion.span>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Link
                      to="/experiences"
                      className={isActive('/experiences') ? activeNavLinkClasses : navLinkClasses}
                    >
                      <BookOpen size={20} />
                      <motion.span variants={textVariants}>Experiences</motion.span>
                    </Link>
                  </>
                )}

                <div className="mb-2">
                  <button
                    onClick={() => toggleDropdown('events')}
                    className={`${navLinkClasses} justify-between`}
                  >
                    <div className="flex items-center">
                      <Calendar size={20} />
                      <motion.span variants={textVariants} className="ml-3">Events</motion.span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${openDropdowns.events ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdowns.events && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-8"
                      >
                        <Link
                          to="/events"
                          className={`${isActive('/events') ? activeNavLinkClasses : navLinkClasses} py-2`}
                        >
                          <motion.span variants={textVariants}>All Events</motion.span>
                        </Link>
                        <Link
                          to="/events/registered"
                          className={`${isActive('/events/registered') ? activeNavLinkClasses : navLinkClasses} py-2`}
                        >
                          <motion.span variants={textVariants}>My Events</motion.span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mb-2">
                  <button
                    onClick={() => toggleDropdown('account')}
                    className={`${navLinkClasses} justify-between`}
                  >
                    <div className="flex items-center">
                      <User size={20} />
                      <motion.span variants={textVariants} className="ml-3">Account</motion.span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${openDropdowns.account ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdowns.account && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-8"
                      >
                        <Link
                          to="/profile"
                          className={`${isActive('/profile') ? activeNavLinkClasses : navLinkClasses} py-2`}
                        >
                          <motion.span variants={textVariants}>Profile</motion.span>
                        </Link>
                        <Link
                          to="/settings"
                          className={`${isActive('/settings') ? activeNavLinkClasses : navLinkClasses} py-2`}
                        >
                          <motion.span variants={textVariants}>Settings</motion.span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // Not logged in navigation
              <>
                <Link
                  to="/login"
                  className={isActive('/login') ? activeNavLinkClasses : navLinkClasses}
                >
                  <LogIn size={20} />
                  <motion.span variants={textVariants}>Login</motion.span>
                </Link>

                <Link
                  to="/register"
                  className={isActive('/register') ? activeNavLinkClasses : navLinkClasses}
                >
                  <UserPlus size={20} />
                  <motion.span variants={textVariants}>Register</motion.span>
                </Link>

                <Link
                  to="/admin-login"
                  className={isActive('/admin-login') ? activeNavLinkClasses : navLinkClasses}
                >
                  <Shield size={20} />
                  <motion.span variants={textVariants}>Admin</motion.span>
                </Link>

                <Link
                  to="/help"
                  className={isActive('/help') ? activeNavLinkClasses : navLinkClasses}
                >
                  <HelpCircle size={20} />
                  <motion.span variants={textVariants}>Help</motion.span>
                </Link>
              </>
            )}
          </div>

              {/* Menu Footer */}
              <div className="mt-auto px-3 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                {(isLoggedIn || isAdmin) && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-600 dark:text-red-400 font-medium py-3 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 w-full"
                  >
                    <LogOut size={20} />
                    <motion.span variants={textVariants}>
                      {isAdmin ? 'Logout from Admin' : 'Logout'}
                    </motion.span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Toggle - Always Visible */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <ThemeToggle />
        </div>
      </motion.div>
    </>
  );
}
