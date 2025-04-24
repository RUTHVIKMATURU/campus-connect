import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Briefcase, CalendarDays, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExperienceDetail() {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/experiences/${id}`);
        setExperience(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch experience details');
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="text-center p-4">
        <p>Experience not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/experiences"
          className="inline-flex items-center text-violet-600 hover:text-violet-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Experiences
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-violet-700 mb-6">{experience.role}</h1>

          <div className="grid gap-6 mb-8">
            <div className="flex items-center text-gray-600">
              <User size={20} className="text-violet-500 mr-3" />
              <span className="font-medium">Posted by:</span>
              <span className="ml-2">{experience.name}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Briefcase size={20} className="text-violet-500 mr-3" />
              <span className="font-medium">Company:</span>
              <span className="ml-2">{experience.company}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <CalendarDays size={20} className="text-violet-500 mr-3" />
              <span className="font-medium">Duration:</span>
              <span className="ml-2">{experience.duration}</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Experience</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{experience.experienceText}</p>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            Posted on: {new Date(experience.createdAt).toLocaleDateString()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}