import { useState, useEffect } from 'react';
import axios from 'axios';
import ExperiencePost from '../components/ExperiencePost';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';

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
    experienceType: '',
    experienceText: ''
  });
  const [filters, setFilters] = useState({
    experienceType: '',
    role: '',
    search: ''
  });
  const { isDarkMode } = useTheme();

  const experienceTypes = [
    { value: 'interview', label: 'Interview Experience', requiresCompany: true },
    { value: 'hackathon', label: 'Hackathon Experience', requiresCompany: false },
    { value: 'coding-contest', label: 'Coding Contest Experience', requiresCompany: false },
    { value: 'internship', label: 'Internship Experience', requiresCompany: true },
    { value: 'workshop', label: 'Workshop Experience', requiresCompany: false },
    { value: 'placement', label: 'Placement Experience', requiresCompany: true }
  ];

  const getRoleOptions = (experienceType) => {
    switch (experienceType) {
      case 'hackathon':
      case 'coding-contest':
      case 'workshop':
        return [
          { value: 'participant', label: 'Participant' },
          { value: 'volunteer', label: 'Volunteer' },
          { value: 'organizer', label: 'Organizer' }
        ];
      case 'interview':
        return [
          { value: 'intern', label: 'Intern Position' },
          { value: 'full-time', label: 'Full Time Position' }
        ];
      case 'internship':
        return [
          { value: 'software-intern', label: 'Software Development Intern' },
          { value: 'data-intern', label: 'Data Science Intern' },
          { value: 'design-intern', label: 'Design Intern' },
          { value: 'other-intern', label: 'Other' }
        ];
      case 'placement':
        return [
          { value: 'software-engineer', label: 'Software Engineer' },
          { value: 'data-scientist', label: 'Data Scientist' },
          { value: 'product-manager', label: 'Product Manager' },
          { value: 'other', label: 'Other' }
        ];
      default:
        return [];
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchExperiences();
  }, [filters]);

  const fetchExperiences = async () => {
    try {
      console.log('Fetching experiences with filters:', filters);
      const params = new URLSearchParams(filters);
      console.log('Request URL:', `http://localhost:5000/api/experiences?${params}`);

      const response = await axios.get(`http://localhost:5000/api/experiences?${params}`);

      console.log('Response received:', response);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      console.log('Experiences data:', response.data);
      console.log('Number of experiences:', response.data.length);

      setExperiences(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });

      setError(err.response?.data?.message || err.message || 'Failed to fetch experiences');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If experience type doesn't require company, remove it from formData
      const submitData = { ...formData };
      const selectedType = experienceTypes.find(type => type.value === formData.experienceType);
      if (!selectedType?.requiresCompany) {
        delete submitData.company;
      }

      await axios.post('http://localhost:5000/api/experiences', submitData);
      setFormData({
        name: '',
        company: '',
        role: '',
        duration: '',
        experienceType: '',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-12 transition-colors duration-300">
      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <h2 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-4">Filter Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience Type
              </label>
              <select
                name="experienceType"
                value={filters.experienceType}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="">All Types</option>
                {experienceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="">All Roles</option>
                {filters.experienceType ? (
                  getRoleOptions(filters.experienceType).map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))
                ) : (
                  // Show all possible roles when no experience type is selected
                  ['participant', 'volunteer', 'organizer', 'intern', 'full-time',
                   'software-intern', 'data-intern', 'design-intern', 'software-engineer',
                   'data-scientist', 'product-manager'].map(role => (
                    <option key={role} value={role}>
                      {role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search experiences..."
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-400">Senior Experiences</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30 hover:shadow-lg flex items-center gap-2"
          >
            {showForm ? 'Cancel' : '+ Share Your Experience'}
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/30 mb-8 border border-gray-100 dark:border-gray-700 transition-all duration-300"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience Type</label>
                <select
                  name="experienceType"
                  value={formData.experienceType}
                  onChange={(e) => {
                    handleChange(e);
                    // Reset role when experience type changes
                    setFormData(prev => ({ ...prev, role: '' }));
                  }}
                  required
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">Select Experience Type</option>
                  {experienceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show company field only if selected experience type requires it */}
              {experienceTypes.find(type => type.value === formData.experienceType)?.requiresCompany && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  />
                </div>
              )}

              {formData.experienceType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  >
                    <option value="">Select Role</option>
                    {getRoleOptions(formData.experienceType).map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {formData.role === 'other' || formData.role === 'other-intern' && (
                    <input
                      type="text"
                      name="customRole"
                      placeholder="Specify your role"
                      value={formData.customRole || ''}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="e.g., 6 months, 2 days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
                <textarea
                  name="experienceText"
                  value={formData.experienceText}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="Share your experience..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30 mt-2"
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
                experienceType={experience.experienceType}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}




