import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccessDenied({ message }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/30 p-8 text-center border border-gray-100 dark:border-gray-700"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {message || 'You need to be logged in to access this page.'}
        </p>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30 flex items-center justify-center"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
