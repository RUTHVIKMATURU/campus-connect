import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
    } catch (err) {
      setError('Error fetching events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {events.map(event => (
        <div key={event._id} className="border rounded-lg p-4 shadow">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
          )}
          <h2 className="text-xl font-bold mb-2">{event.title}</h2>
          <p className="text-gray-600 mb-2">{event.description}</p>
          <p className="text-sm">
            Date: {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-sm">Venue: {event.venue}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;