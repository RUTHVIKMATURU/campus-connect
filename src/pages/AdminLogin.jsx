import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function AdminLogin({ setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (username === envUsername && password === envPassword) {
      localStorage.setItem('isAdmin', 'true');
      if (setIsAdmin) setIsAdmin(true);
      navigate('/admin-dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-100"
        >
          <div className="text-center mb-8">
            <Shield size={40} className="mx-auto mb-4 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-300"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}
