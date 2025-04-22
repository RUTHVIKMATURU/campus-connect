import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Briefcase, Building2, Mail } from 'lucide-react';

export default function Seniors() {
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchSeniors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students/seniors');
        setSeniors(response.data);
      } catch (error) {
        console.error('Error fetching seniors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeniors();
  }, []);

  const filteredSeniors = filter === 'all' 
    ? seniors
    : seniors.filter(senior => senior.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-8">
          Connect with Seniors
        </h1>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            All Seniors
          </button>
          <button
            onClick={() => setFilter('placed')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === 'placed'
                ? 'bg-secondary-600 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-50'
            }`}
          >
            Placed
          </button>
          <button
            onClick={() => setFilter('pursuing')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === 'pursuing'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            Pursuing
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeniors.map((senior) => (
              <div key={senior.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {senior.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{senior.name}</h3>
                      <p className="text-gray-600">{senior.branch} - {senior.batch}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-600">
                    {senior.status === 'placed' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Building2 size={18} />
                          <span>{senior.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} />
                          <span>{senior.role}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail size={18} />
                      <span>{senior.email}</span>
                    </div>
                  </div>

                  <Link
                    to={`/personal-chat/${senior.id}`}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300"
                  >
                    <MessageSquare size={18} />
                    Start Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

