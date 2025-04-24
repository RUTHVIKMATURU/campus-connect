import { useState, useEffect } from 'react';
import axios from 'axios';
import ExperiencePost from '../components/ExperiencePost';
import { motion } from 'framer-motion';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    duration: '',
    experienceText: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/experiences');
      setExperiences(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch experiences');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/experiences', formData);
      setFormData({
        name: '',
        company: '',
        role: '',
        duration: '',
        experienceText: ''
      });
      setShowForm(false);
      fetchExperiences();
    } catch (err) {
      setError('Failed to submit experience');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-violet-700">Senior Experiences</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Share Your Experience'}
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md mb-8"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                  placeholder="e.g., 6 months, 2 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <textarea
                  name="experienceText"
                  value={formData.experienceText}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                  placeholder="Share your experience..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Submit Experience
              </button>
            </div>
          </motion.form>
        )}

        <div className="space-y-6">
          {experiences.map((experience) => (
            <motion.div
              key={experience._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExperiencePost
                id={experience._id}
                role={experience.role}
                company={experience.company}
                date={experience.duration}
                description={experience.experienceText}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
