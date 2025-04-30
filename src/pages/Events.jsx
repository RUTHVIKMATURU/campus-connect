import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosConfig';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });

  const categories = [
    { value: 'fun', label: 'Fun Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'guest-lecture', label: 'Guest Lectures' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'coding-contest', label: 'Coding Contests' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams(filters);
      const response = await axiosInstance.get(`/events?${params}`);
      
      // The response should now contain the data property from the server
      const eventsData = response.data || []; // Access the data array from response
      
      // Format the events with default values if needed
      const formattedEvents = eventsData.map(event => ({
        ...event,
        time: event.time || { start: 'N/A', end: 'N/A' },
        status: event.status || 'upcoming',
        registrationCount: event.registrationCount || 0,
        cost: event.cost || 0,
        venue: event.venue || 'TBA',
        imageUrl: event.imageUrl || 'https://via.placeholder.com/400x200'
      }));

      setEvents(formattedEvents);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <select
            name="category"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 mb-4 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 overflow-hidden"
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
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}




