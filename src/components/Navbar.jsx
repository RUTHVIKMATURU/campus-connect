import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  
  // State to track the logged-in user from localStorage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Retrieve the isAdmin status from localStorage
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

  useEffect(() => {
    // Update the user state whenever the login status changes
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, [isLoggedIn]);

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin'); // Optionally remove isAdmin
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-sky-900 via-indigo-800 to-sky-500 px-6 py-4 text-white shadow-2xl backdrop-blur-md bg-opacity-80 border-b-2 border-blue-400">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wide animate-text bg-gradient-to-r from-blue-300 via-green-400 to-sky-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] hover:brightness-110 transition-all duration-300"
        >
          Campus Connect
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 text-lg items-center font-semibold">
          <Link
            to="/"
            className="hover:text-yellow-300 hover:scale-110 transition-all duration-300 ease-in-out drop-shadow hover:drop-shadow-[0_0_10px_rgba(255,255,0,0.6)]"
          >
            Home
          </Link>

          <Link
            to="/events"
            className="hover:text-pink-300 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(255,192,203,0.6)]"
          >
            Events
          </Link>

          <Link
            to="/placements"
            className="hover:text-green-300 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(144,238,144,0.6)]"
          >
            Placements
          </Link>

          <Link
            to="/experience"
            className="hover:text-indigo-300 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(173,216,230,0.6)]"
          >
            Experience
          </Link>

          <Link
            to="/group-chat"
            className="hover:text-orange-300 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(255,165,0,0.6)]"
          >
            Group Chat
          </Link>

          {/* Conditionally render Admin Dashboard if user is logged in and isAdmin is true */}
          {isAdmin && (
            <Link
              to="/admin-dashboard"
              className="hover:text-purple-300 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(128,0,128,0.6)]"
            >
              Admin Dashboard
            </Link>
          )}

          {/* Show Login/Register links if not logged in */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="hover:text-cyan-300 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]"
              >
                Login
              </Link>
              <Link
                to="/admin-login"
                className="hover:text-cyan-500 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(0,55,255,0.6)]"
              >
                Admin Login
              </Link>
              <Link
                to="/register"
                className="hover:text-fuchsia-300 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-red-300 hover:scale-110 transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_10px_rgba(255,99,71,0.6)]"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
