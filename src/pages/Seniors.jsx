import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Seniors() {
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
      return;
    }

    const fetchSeniors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/seniors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.data) {
          throw new Error('No data received');
        }

        // Filter seniors based on user's year
        const filteredSeniors = response.data.filter(senior => {
          const seniorYear = parseInt(senior.year);
          const userYear = parseInt(user?.year) || 0;
          return seniorYear > userYear;
        });

        setSeniors(filteredSeniors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seniors:', error);
        setError(error.response?.data?.message || 'Failed to fetch seniors. Please try again.');
        setLoading(false);
      }
    };

    fetchSeniors();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-600 text-center mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Connect with Seniors</h1>
      
      {seniors.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No seniors available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seniors.map(senior => (
            <div key={senior._id} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold">{senior.name}</h3>
              <p className="text-gray-600">{senior.branch} - {senior.year} Year</p>
              <p className="text-gray-600">{senior.status}</p>
              {senior.company && (
                <p className="text-gray-600">Working at: {senior.company}</p>
              )}
              <Link 
                to={`/personal-chat/${senior._id}`}
                className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Chat with {senior.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


