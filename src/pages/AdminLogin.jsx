import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-sky-800 mb-4">Admin Login</h2>
        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 px-4 py-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700">
          Login
        </button>
      </form>
    </div>
  );
}
