import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Briefcase, GraduationCap, Building2, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const renderActionButton = () => {
    if (!user) {
      return (
        <Link
          to="/login"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
        >
          <Users size={20} />
          Login to Connect
        </Link>
      );
    }

    if (user.role === 'senior') {
      return (
        <Link
          to="/senior-messages"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
        >
          <MessageSquare size={20} />
          View Messages
        </Link>
      );
    }

    return (
      <Link
        to="/seniors"
        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
      >
        <Users size={20} />
        Connect with Seniors
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-6 text-blue-600"
        >
          Welcome to Campus Connect
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-700 mb-8"
        >
          Your gateway to connect with seniors, explore opportunities, and grow together
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          {renderActionButton()}
          <Link
            to="/events"
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
          >
            <Calendar size={20} />
            Explore Events
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Connect with Seniors?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Career Guidance */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Career Guidance</h3>
              <p className="text-gray-600">Get valuable insights about career paths and industry trends</p>
            </div>

            {/* Interview Prep */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Interview Prep</h3>
              <p className="text-gray-600">Learn interview strategies and get mock interview practice</p>
            </div>

            {/* Academic Support */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Academic Support</h3>
              <p className="text-gray-600">Get help with coursework and study strategies</p>
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-blue-600 rounded-lg p-8 text-white mb-16">
            <h3 className="text-2xl font-bold mb-6">Upcoming Events</h3>
            <p className="mb-6">Join workshops, guest lectures, and networking events to enhance your skills and expand your network.</p>
            <Link 
              to="/events"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Calendar size={20} />
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Success Stories */}
          <div className="bg-blue-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Success Stories</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={20} />
                  <span className="font-semibold">Google</span>
                </div>
                <p className="text-sm">"The mentorship from seniors helped me land my dream job!"</p>
                <p className="text-sm mt-2 font-medium">- Priya S.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={20} />
                  <span className="font-semibold">Microsoft</span>
                </div>
                <p className="text-sm">"Got amazing interview tips from experienced seniors."</p>
                <p className="text-sm mt-2 font-medium">- Rahul K.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={20} />
                  <span className="font-semibold">Amazon</span>
                </div>
                <p className="text-sm">"Seniors guided me through the entire placement process."</p>
                <p className="text-sm mt-2 font-medium">- Aisha M.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
