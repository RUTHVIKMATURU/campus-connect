import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      alert('Login successful!');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-cyan-700">Student Login</h2>

        <div>
          <label className="block mb-1 font-medium text-cyan-800">Registration Number</label>
          <input
            type="text"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="eg: 2X071AXXXX"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-cyan-800">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg font-medium transition ${loading ? 'bg-cyan-400' : 'bg-cyan-600 hover:bg-cyan-700'}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
