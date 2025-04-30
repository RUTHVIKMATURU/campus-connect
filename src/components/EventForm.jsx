import React, { useState } from 'react';
import axios from 'axios';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('image', formData.image);

      await axios.post('http://localhost:5000/api/events', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        venue: '',
        image: null
      });
      alert('Event created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="mb-4">
        <label className="block mb-2">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Venue:</label>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventForm;