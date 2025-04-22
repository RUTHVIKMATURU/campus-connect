import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regNo.trim() || !password.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        regNo,
        password,
      });

      const { token, user } = res.data; 
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
      navigate('/');
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || 'Login failed';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-100 animate-fade-in"
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-8">
            Welcome Back
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Registration Number</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your reg number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center space-y-2">
            <Link 
              to="/register" 
              className="text-primary-600 hover:text-primary-800 font-medium transition-colors duration-300"
            >
              Create an account
            </Link>
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
