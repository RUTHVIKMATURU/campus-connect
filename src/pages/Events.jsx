import { useState, useEffect } from 'react';
import { Calendar, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useTheme } from '../theme/ThemeContext';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const categories = [
    { value: 'fun', label: 'Fun Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'guest-lecture', label: 'Guest Lectures' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'coding-contest', label: 'Coding Contests' }
  ];

  const statuses = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'past', label: 'Past' }
  ];

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({ ...prev, search: value }));
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters for filtering
      const queryParams = {};
      if (filters.category) queryParams.category = filters.category;
      if (filters.status) queryParams.status = filters.status;
      if (filters.search) queryParams.search = filters.search;

      // Convert to URLSearchParams
      const params = new URLSearchParams(queryParams);

      // Fetch events from the server
      const response = await axiosInstance.get(`/events?${params}`);

      // Format the events with default values if needed
      const formattedEvents = Array.isArray(response) ? response.map(event => ({
        ...event,
        time: event.time || { start: 'N/A', end: 'N/A' },
        status: event.status || 'upcoming',
        registrationCount: event.registrationCount || 0,
        cost: event.cost || 0,
        venue: event.venue || 'TBA',
        imageUrl: event.imageUrl || 'https://via.placeholder.com/400x200'
      })) : [];

      setEvents(formattedEvents);
    } catch (error) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-400 mb-4">Campus Events</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover workshops, guest lectures, and networking events to enhance your skills and expand your network.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 shadow-sm w-full sm:w-auto"
            />
          </div>

          {/* Category Filter */}
          <select
            name="category"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 shadow-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            name="status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 shadow-sm"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {(filters.category || filters.status || filters.search) && (
            <button
              onClick={() => setFilters({ category: '', status: '', search: '' })}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 dark:text-red-400 mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30 max-w-2xl mx-auto shadow-md">
          <p className="font-medium text-center">{error}</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {events.length === 0 ? (
            <div className="col-span-3 text-center py-16">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No events found</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back later for upcoming events</p>
            </div>
          ) : (
            events.map(event => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="relative h-48">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <MapPin className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="w-full py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}




