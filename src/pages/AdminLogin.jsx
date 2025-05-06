import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

export default function AdminLogin({ setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Check if already logged in as admin
    const isAdminStored = localStorage.getItem('isAdmin');
    if (isAdminStored === 'true') {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    try {
      if (username === envUsername && password === envPassword) {
        const adminToken = btoa(`admin-${Date.now()}`);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('token', adminToken);
        setIsAdmin(true);
        navigate('/admin-dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl dark:shadow-gray-900/30 space-y-6 border border-gray-100 dark:border-gray-700 transition-all duration-300"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
              <Shield size={32} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Admin Login</h2>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-lg text-sm text-center border border-red-100 dark:border-red-800/30">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter admin username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md dark:shadow-indigo-900/30"
          >
            {loading ? 'Signing in...' : 'Login as Admin'}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-300"
            >
              Student Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
