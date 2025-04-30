import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    regNo: '',
    name: '',
    email: '',
    password: '',
    branch: '',
    year: '',
    section: '',
    status: 'pursuing',
    batch: '',
    role: 'student',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If the year field is being changed
    if (name === 'year') {
      const newRole = value === '4th' ? 'senior' : 'student';
      setFormData(prev => ({
        ...prev,
        [name]: value,
        role: newRole, // Automatically set role based on year
        // Clear company field if switching to student
        company: newRole === 'student' ? '' : prev.company
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Registration Number
            </label>
            <input
              type="text"
              name="regNo"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={formData.regNo}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Year
            </label>
            <select
              name="year"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={formData.year}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Branch
            </label>
            <select
              name="branch"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={formData.branch}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="CSE-AIML">CSE-AIML</option>
              <option value="CSE-DS">CSE-DS</option>
              <option value="CSBS">CSBS</option>
              <option value="AIDS">AIDS</option>
              <option value="CSE-IOT">CSE-IOT</option>
              <option value="CSE-CYS">CSE-CYS</option>
              <option value="EIE">EIE</option>
              <option value="AME">AME</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="IT">IT</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Section
            </label>
            <select
              name="section"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={formData.section}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Batch
            </label>
            <select
              name="batch"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={formData.batch}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Batch</option>
              <option value="2020-2024">2020-2024</option>
              <option value="2021-2025">2021-2025</option>
              <option value="2022-2026">2022-2026</option>
              <option value="2023-2027">2023-2027</option>
            </select>
          </div>

          {/* Show company field only for seniors (4th year students) */}
          {formData.role === 'senior' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={formData.company}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your company name"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
