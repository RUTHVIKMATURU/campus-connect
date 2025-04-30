import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, Briefcase, GraduationCap, Mail, MessageSquare, MapPin, Award } from 'lucide-react';

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
        const response = await axios.get('http://localhost:5000/api/students/seniors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.data) {
          throw new Error('No data received');
        }

        const filteredSeniors = response.data.filter(senior => {
          const seniorYear = parseInt(senior.year);
          const userYear = parseInt(user?.year) || 0;
          return seniorYear > userYear;
        });

        setSeniors(filteredSeniors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seniors:', error);
        setError(error.response?.data?.message || 'Failed to fetch seniors');
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">Connect with Seniors</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get guidance from experienced seniors who have walked the path before you. 
            Connect for mentorship, career advice, and valuable insights.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-12 backdrop-blur-sm bg-white/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
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
          <div className="text-center bg-white rounded-2xl shadow-soft p-12">
            <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No seniors found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSeniors.map(senior => (
              <div key={senior._id} 
                className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{senior.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap size={18} />
                      <span>{senior.branch} - {senior.year} Year</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    senior.status === 'placed' ? 'bg-green-100 text-green-800' :
                    senior.status === 'intern' ? 'bg-blue-100 text-blue-800' :
                    senior.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                    senior.status === 'pursuing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {allStatuses.find(s => s.value === senior.status)?.label || senior.status}
                  </div>
                </div>

                {senior.company && (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <Building2 size={18} />
                    <span>Working at {senior.company}</span>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award size={18} />
                    <span>Senior Mentor</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>Campus Ambassador</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link 
                    to={`/personal-chat/${senior._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300"
                  >
                    <MessageSquare size={18} />
                    <span>Chat Now</span>
                  </Link>
                  <button 
                    className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                    title="Send Email"
                  >
                    <Mail size={18} className="text-gray-600" />
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






