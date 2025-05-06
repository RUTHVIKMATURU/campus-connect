import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosConfig';
import { useTheme } from '../theme/ThemeContext';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch event details from the server
      const response = await axiosInstance.get(`/events/${id}`);

      // Format the event with default values if needed
      const eventData = response || {};
      const formattedEvent = {
        ...eventData,
        time: eventData.time || { start: 'N/A', end: 'N/A' },
        status: eventData.status || 'upcoming',
        registrationCount: eventData.registrationCount || 0,
        cost: eventData.cost || 0,
        venue: eventData.venue || 'TBA',
        imageUrl: eventData.imageUrl || 'https://via.placeholder.com/800x400',
        organizer: eventData.organizer || 'Campus Connect',
        contactEmail: eventData.contactEmail || 'info@campusconnect.com',
        contactPhone: eventData.contactPhone || 'N/A'
      };

      setEvent(formattedEvent);

      // Check if user is registered
      // This would typically come from your API
      setRegistered(false);
    } catch (error) {
      setError('Failed to load event details. Please try again later.');
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Error copying link:', error));
    }
  };

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
              onClick={() => navigate('/events')}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 text-xl font-semibold mb-4">Event not found</div>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Image Section */}
      <div className="w-full py-6 relative bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[1000px] mx-auto flex justify-center items-center">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-auto object-contain rounded-lg shadow-xl dark:shadow-gray-900/30"
            style={{ maxWidth: '600px', width: '100%', minHeight: '200px', margin: '0 auto' }}
            onError={(e) => {
              console.log('Image failed to load:', event.imageUrl);
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
            }}
          />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-300"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-300"
        >
          <Share2 size={24} />
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/30 p-6 md:p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300"
          >
            {/* Event Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>

            {/* Event Status */}
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                event.status === 'upcoming'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  : event.status === 'ongoing'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                  <span>{event.time.start} - {event.time.end}</span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                  <span>{event.venue}</span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Users className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                  <span>{event.registrationCount} registered</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Organizer Information</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><span className="font-medium">Organized by:</span> {event.organizer}</p>
                  <p><span className="font-medium">Contact Email:</span> {event.contactEmail}</p>
                  <p><span className="font-medium">Contact Phone:</span> {event.contactPhone}</p>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Event</h2>
              <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p>{event.description}</p>
              </div>
            </div>


          </motion.div>
        </div>
      </div>
    </div>
  );
}
