import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function AdminLogin({ setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-100"
        >
          <div className="text-center mb-8">
            <Shield size={40} className="mx-auto mb-4 text-blue-600" />
            <h2 className="text-3xl font-bold text-blue-600">Admin Login</h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter admin username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium transform hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login as Admin'}
          </button>

          <div className="text-center mt-4">
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
            >
              Student Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
