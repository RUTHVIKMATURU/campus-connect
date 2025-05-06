import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, Briefcase, GraduationCap, Mail, MessageSquare, MapPin, Award } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

export default function Seniors() {
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    branch: '',
    status: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const { isDarkMode } = useTheme();

  // Define all available branches
  const allBranches = [
    { value: "CSE", label: "CSE" },
    { value: "CSE-AIML", label: "CSE-AIML" },
    { value: "CSE-DS", label: "CSE-DS" },
    { value: "CSBS", label: "CSBS" },
    { value: "AIDS", label: "AIDS" },
    { value: "CSE-IOT", label: "CSE-IOT" },
    { value: "CSE-CYS", label: "CSE-CYS" },
    { value: "EIE", label: "EIE" },
    { value: "AME", label: "AME" },
    { value: "ECE", label: "ECE" },
    { value: "EEE", label: "EEE" }
  ];

  // Define all possible statuses
  const allStatuses = [
    { value: "pursuing", label: "Pursuing" },
    { value: "placed", label: "Placed" },
    { value: "intern", label: "Intern" },
    { value: "completed", label: "Completed" }
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchSeniors = async () => {
      try {
        console.log('Fetching seniors with token:', token ? 'Token exists' : 'No token');
        console.log('Current user:', user);

        const response = await axios.get('http://localhost:5000/api/students/seniors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response received:', response);

        if (!response.data) {
          throw new Error('No data received');
        }

        console.log('Seniors data received:', response.data);
        console.log('Number of seniors:', response.data.length);

        // Don't filter by year for now, just show all seniors
        const filteredSeniors = response.data;

        // Uncomment this to re-enable year filtering
        /*
        const filteredSeniors = response.data.filter(senior => {
          // Extract just the number from strings like "4th", "2nd", etc.
          const seniorYearMatch = senior.year.match(/^(\d+)/);
          const userYearMatch = user?.year?.match(/^(\d+)/);

          const seniorYear = seniorYearMatch ? parseInt(seniorYearMatch[1]) : 0;
          const userYear = userYearMatch ? parseInt(userYearMatch[1]) : 0;

          console.log('Filtering senior:', senior.name, 'Year:', senior.year, '→', seniorYear);
          console.log('User year:', user?.year, '→', userYear);

          return seniorYear > userYear;
        });
        */

        console.log('Filtered seniors:', filteredSeniors);
        setSeniors(filteredSeniors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seniors:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        setError(error.response?.data?.message || error.message || 'Failed to fetch seniors');
        setLoading(false);
      }
    };

    fetchSeniors();
  }, [navigate, token, user?.year]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredSeniors = seniors.filter(senior => {
    return (
      (!filters.branch || senior.branch === filters.branch) &&
      (!filters.status || senior.status === filters.status)
    );
  });

  const uniqueStatuses = [...new Set(seniors.map(senior => senior.status))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-red-600 dark:text-red-400 text-xl font-semibold mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-400 mb-4">Connect with Seniors</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get guidance from experienced seniors who have walked the path before you.
            Connect for mentorship, career advice, and valuable insights.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 mb-12 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Branch</label>
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="">All Branches</option>
                {allBranches.map(branch => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="">All Statuses</option>
                {allStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seniors Grid */}
        {filteredSeniors.length === 0 ? (
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-12 border border-gray-100 dark:border-gray-700 transition-all duration-300">
            <GraduationCap size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No seniors found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSeniors.map(senior => (
              <div key={senior._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{senior.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <GraduationCap size={18} className="text-indigo-600 dark:text-indigo-400" />
                      <span>{senior.branch} - {senior.year} Year</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    senior.status === 'placed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    senior.status === 'intern' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                    senior.status === 'completed' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
                    senior.status === 'pursuing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {allStatuses.find(s => s.value === senior.status)?.label || senior.status}
                  </div>
                </div>

                {senior.company && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4">
                    <Building2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Working at {senior.company}</span>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Award size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Senior Mentor</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Campus Ambassador</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/personal-chat/${senior._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
                  >
                    <MessageSquare size={18} />
                    <span>Chat Now</span>
                  </Link>
                  <button
                    className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-gray-700 dark:text-gray-300"
                    title="Send Email"
                  >
                    <Mail size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}






