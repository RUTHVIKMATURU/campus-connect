import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Welcome to the Student Resource Platform
        </h1>
        <p className="text-gray-600 text-lg">
          Explore events, placement updates, and connect with seniors!
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Placements */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">🎓 Placements</h3>
          <p className="text-gray-600 text-sm mb-4">
            See latest placement updates, packages, and top recruiters.
          </p>
          <Link to="/placements" className="text-blue-700 font-medium hover:underline">
            View Placements →
          </Link>
        </div>

        {/* Events */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">🎉 Events</h3>
          <p className="text-gray-600 text-sm mb-4">
            Don’t miss college fests, webinars, and tech meets.
          </p>
          <Link to="/events" className="text-blue-700 font-medium hover:underline">
            Explore Events →
          </Link>
        </div>
      </div>

      {/* Notice Board */}
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-900 p-4 rounded-lg mb-12">
        <p className="font-medium">📢 Announcements:</p>
        <ul className="list-disc ml-5 text-sm mt-1">
          <li>Placement registrations close on April 15</li>
          <li>TechFest 2025 registrations open now!</li>
        </ul>
      </div>

      {/* Quote Section */}
      <div className="text-center max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <blockquote className="text-gray-700 italic">
          "This platform helped me prep for interviews and discover amazing opportunities."
        </blockquote>
        <p className="mt-2 text-blue-800 font-semibold">— A Final Year Student</p>
      </div>
    </div>
  );
}

export default Home;
