import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Briefcase, GraduationCap, Building2, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';

function Home() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const { isDarkMode } = useTheme();

  const renderActionButton = () => {
    if (!user) {
      return (
        <Link
          to="/login"
          className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 flex items-center gap-2 shadow-md dark:shadow-indigo-900/30"
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
          className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 flex items-center gap-2 shadow-md dark:shadow-indigo-900/30"
        >
          <MessageSquare size={20} />
          View Messages
        </Link>
      );
    }

    return (
      <Link
        to="/seniors"
        className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 flex items-center gap-2 shadow-md dark:shadow-indigo-900/30"
      >
        <Users size={20} />
        Connect with Seniors
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-6 text-primary-600 dark:text-indigo-400"
        >
          Welcome to Campus Connect
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-700 dark:text-gray-200 mb-8"
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
            className="px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-300 flex items-center gap-2 shadow-md dark:shadow-purple-900/30"
          >
            <Calendar size={20} />
            Explore Events
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-20 px-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Why Connect with Seniors?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Career Guidance */}
            <div className="bg-blue-50 dark:bg-gray-700 p-8 rounded-xl shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/70 border border-transparent dark:border-gray-600/30">
              <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-5">
                <Briefcase className="text-indigo-600 dark:text-indigo-400" size={26} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Career Guidance</h3>
              <p className="text-gray-600 dark:text-gray-300">Get valuable insights about career paths and industry trends</p>
            </div>

            {/* Interview Prep */}
            <div className="bg-purple-50 dark:bg-gray-700 p-8 rounded-xl shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/70 border border-transparent dark:border-gray-600/30">
              <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-5">
                <MessageSquare className="text-purple-600 dark:text-purple-400" size={26} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Interview Prep</h3>
              <p className="text-gray-600 dark:text-gray-300">Learn interview strategies and get mock interview practice</p>
            </div>

            {/* Academic Support */}
            <div className="bg-blue-50 dark:bg-gray-700 p-8 rounded-xl shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/70 border border-transparent dark:border-gray-600/30">
              <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-5">
                <GraduationCap className="text-blue-600 dark:text-blue-400" size={26} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Academic Support</h3>
              <p className="text-gray-600 dark:text-gray-300">Get help with coursework and study strategies</p>
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-xl p-10 text-white mb-16 shadow-lg dark:shadow-indigo-900/30 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6">Upcoming Events</h3>
            <p className="mb-8 text-white/90 dark:text-white/80 max-w-2xl">Join workshops, guest lectures, and networking events to enhance your skills and expand your network.</p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md dark:shadow-black/20"
            >
              <Calendar size={20} />
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Success Stories */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 rounded-xl p-10 text-white shadow-lg dark:shadow-purple-900/30 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-8">Success Stories</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm shadow-md dark:shadow-black/20 transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-800/40 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 dark:bg-white/5 rounded-lg">
                    <Building2 size={22} className="text-white" />
                  </div>
                  <span className="font-semibold text-lg">Google</span>
                </div>
                <p className="text-white/80 dark:text-white/70">"The mentorship from seniors helped me land my dream job!"</p>
                <p className="text-sm mt-3 font-medium text-white/90">- Priya S.</p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm shadow-md dark:shadow-black/20 transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-800/40 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 dark:bg-white/5 rounded-lg">
                    <Building2 size={22} className="text-white" />
                  </div>
                  <span className="font-semibold text-lg">Microsoft</span>
                </div>
                <p className="text-white/80 dark:text-white/70">"Got amazing interview tips from experienced seniors."</p>
                <p className="text-sm mt-3 font-medium text-white/90">- Rahul K.</p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm shadow-md dark:shadow-black/20 transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-800/40 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 dark:bg-white/5 rounded-lg">
                    <Building2 size={22} className="text-white" />
                  </div>
                  <span className="font-semibold text-lg">Amazon</span>
                </div>
                <p className="text-white/80 dark:text-white/70">"Seniors guided me through the entire placement process."</p>
                <p className="text-sm mt-3 font-medium text-white/90">- Aisha M.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
