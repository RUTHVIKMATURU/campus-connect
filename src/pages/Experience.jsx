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
    experienceType: '',
    experienceText: ''
  });
  const [filters, setFilters] = useState({
    experienceType: '',
    role: '',
    search: ''
  });

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
      const params = new URLSearchParams(filters);
      const response = await axios.get(`http://localhost:5000/api/experiences?${params}`);
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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white px-4 py-12">
      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-soft p-6 backdrop-blur-sm bg-white/50">
          <h2 className="text-lg font-semibold text-primary-800 mb-4">Filter Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-accent-600 mb-2">
                Experience Type
              </label>
              <select
                name="experienceType"
                value={filters.experienceType}
                onChange={handleFilterChange}
                className="w-full p-3 border border-accent-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white transition-all duration-200"
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
              <label className="block text-sm font-medium text-accent-600 mb-2">
                Role
              </label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full p-3 border border-accent-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white transition-all duration-200"
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
              <label className="block text-sm font-medium text-accent-600 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search experiences..."
                className="w-full p-3 border border-accent-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-900">Senior Experiences</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            {showForm ? 'Cancel' : '+ Share Your Experience'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Type</label>
                <select
                  name="experienceType"
                  value={formData.experienceType}
                  onChange={(e) => {
                    handleChange(e);
                    // Reset role when experience type changes
                    setFormData(prev => ({ ...prev, role: '' }));
                  }}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
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
              )}

              {formData.experienceType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
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
                      className="mt-2 w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                  placeholder="e.g., 6 months, 2 days"
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




