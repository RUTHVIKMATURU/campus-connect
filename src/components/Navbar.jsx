import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar({ isLoggedIn, onLogout, isAdmin }) {
  return (
    <nav className="bg-gradient-to-r from-primary-900 to-secondary-800 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-secondary-200 hover:scale-105 transition-all duration-300"
        >
          Campus Connect
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 text-lg items-center">
          <Link
            to="/"
            className="text-gray-200 hover:text-white hover:scale-105 transition-all duration-300 relative group"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>

          <Link
            to="/events"
            className="text-gray-200 hover:text-white hover:scale-105 transition-all duration-300 relative group"
          >
            <span>Events</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>

          <Link
            to="/placements"
            className="text-gray-200 hover:text-white hover:scale-105 transition-all duration-300 relative group"
          >
            <span>Placements</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>

          {isLoggedIn && (
            <Link
              to="/group-chat"
              className="text-gray-200 hover:text-white hover:scale-105 transition-all duration-300 relative group"
            >
              <span>Group Chat</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          )}

          {isLoggedIn && (
            <Link
              to="/seniors"
              className="text-gray-200 hover:text-white hover:scale-105 transition-all duration-300 relative group"
            >
              <span>Connect with Seniors</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
