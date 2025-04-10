import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  GraduationCap,
  LogIn,
  UserPlus,
  MessageCircle,
  LogOut,
} from 'lucide-react';

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-sky-900 to-sky-500 px-6 py-4 text-white shadow-2xl backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wide flex items-center gap-3">
          <GraduationCap size={30} className="text-yellow-300 drop-shadow-md" />
          <Link
            to="/"
            className="hover:text-pink-100 transition-all duration-300"
          >
            Campus Connect
          </Link>
        </div>

        {/* Navigation Icons */}
        <div className="flex gap-6 text-lg items-center">
          <Link
            to="/"
            className="hover:text-white hover:scale-110 transition-transform duration-300"
            title="Home"
          >
            <Home size={26} className="drop-shadow-sm" />
          </Link>

          <Link
            to="/events"
            className="hover:text-white hover:scale-110 transition-transform duration-300"
            title="Events"
          >
            Events
          </Link>

          <Link
            to="/experience"
            className="hover:text-white hover:scale-110 transition-transform duration-300"
            title="Experience"
          >
            Experience
          </Link>

          <Link
            to="/group-chat"
            className="hover:text-white hover:scale-110 transition-transform duration-300"
            title="Group Chat"
          >
            <MessageCircle size={26} className="drop-shadow-sm" />
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="hover:text-white hover:scale-110 transition-transform duration-300"
                title="Login"
              >
                <LogIn size={26} className="drop-shadow-sm" />
              </Link>
              <Link
                to="/register"
                className="hover:text-white hover:scale-110 transition-transform duration-300"
                title="Register"
              >
                <UserPlus size={26} className="drop-shadow-sm" />
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              title="Logout"
              className="hover:text-white hover:scale-110 transition-transform duration-300"
            >
              <LogOut size={26} className="drop-shadow-sm" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
