import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import axios from 'axios';
import { motion } from 'framer-motion';
export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-pink-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-sky-800 mb-10">
        Upcoming Events 🎉
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming events</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EventCard
                title={event.title}
                date={new Date(event.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
                location={event.location}
                description={event.description}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
