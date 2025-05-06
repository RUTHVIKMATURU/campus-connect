import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Briefcase, CalendarDays, User, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';

export default function ExperienceDetail() {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        console.log('Fetching experience with ID:', id);
        const response = await axios.get(`http://localhost:5000/api/experiences/${id}`);

        console.log('Response received:', response);

        if (!response.data) {
          throw new Error('No data received from server');
        }

        console.log('Experience data:', response.data);
        setExperience(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching experience details:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });

        setError(err.response?.data?.message || err.message || 'Failed to fetch experience details');
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-red-600 dark:text-red-400 text-xl font-semibold mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-gray-800 dark:text-gray-200 text-xl font-semibold mb-4">Experience not found</div>
            <Link
              to="/experiences"
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30 inline-block"
            >
              Back to Experiences
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/experiences"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors duration-300"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Experiences
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300"
        >
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">{experience.role}</h1>

          <div className="grid gap-6 mb-8">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <User size={20} className="text-indigo-600 dark:text-indigo-400 mr-3" />
              <span className="font-medium">Posted by:</span>
              <span className="ml-2">{experience.name}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400 mr-3" />
              <span className="font-medium">Company:</span>
              <span className="ml-2">{experience.company}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <CalendarDays size={20} className="text-indigo-600 dark:text-indigo-400 mr-3" />
              <span className="font-medium">Duration:</span>
              <span className="ml-2">{experience.duration}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Tag size={20} className="text-indigo-600 dark:text-indigo-400 mr-3" />
              <span className="font-medium">Experience Type:</span>
              <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400">
                {experience.experienceType ?
                  experience.experienceType.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ') :
                  'Experience'
                }
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Experience</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{experience.experienceText}</p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Posted on: {new Date(experience.createdAt).toLocaleDateString()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
