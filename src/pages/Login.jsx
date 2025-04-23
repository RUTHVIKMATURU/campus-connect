import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    regNo: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      navigate('/');
    }
  }, [navigate]);

  const validateForm = () => {
    if (!formData.regNo.trim()) {
      setError('Registration number is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, user } = response.data;
      
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        onLogin?.(user);
        navigate('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-8">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Registration Number
              </label>
              <input
                type="text"
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your registration number"
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
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary-600 hover:text-primary-800 font-medium transition-colors duration-300"
              >
                Create an account
              </Link>
            </p>
            <div className="border-t border-gray-200 pt-4">
              <Link 
                to="/admin-login" 
                className="text-secondary-600 hover:text-secondary-800 font-medium transition-colors duration-300"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

