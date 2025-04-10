// Placement Schema Fields:
// name (student name), company, branch, package, date (placement date)

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function AdminDashboard() {
  const [storedEvents, setStoredEvents] = useState([]);
  const [storedPlacements, setStoredPlacements] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPlacementForm, setShowPlacementForm] = useState(false);
  const [message, setMessage] = useState('');
  const [placementMessage, setPlacementMessage] = useState('');

  const {
    register: registerEvent,
    handleSubmit: handleSubmitEvent,
    reset: resetEvent,
  } = useForm();

  const {
    register: registerPlacement,
    handleSubmit: handleSubmitPlacement,
    reset: resetPlacement,
  } = useForm();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      window.location.href = '/';
    }

    axios.get('http://localhost:5000/api/events')
      .then((res) => setStoredEvents(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/placements')
      .then((res) => setStoredPlacements(res.data))
      .catch(console.error);
  }, []);

  const onSubmitEvent = async (data) => {
    try {
      const res = await axios.post('http://localhost:5000/api/events', data);
      setStoredEvents((prev) => [...prev, res.data]);
      setMessage('Event added successfully!');
      resetEvent();
      setTimeout(() => setMessage(''), 2500);
    } catch (error) {
      console.error(error);
      setMessage('Failed to add event.');
    }
  };

  const onSubmitPlacement = async (data) => {
    try {
      const res = await axios.post('http://localhost:5000/api/placements', data);
      setStoredPlacements((prev) => [...prev, res.data]);
      setPlacementMessage('Placement added successfully!');
      resetPlacement();
      setTimeout(() => setPlacementMessage(''), 2500);
    } catch (error) {
      console.error(error);
      setPlacementMessage('Failed to add placement.');
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-tr from-sky-100 to-sky-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-sky-700 drop-shadow-sm">
        Admin Dashboard
      </h1>

      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => {
            setShowEventForm(true);
            setShowPlacementForm(false);
          }}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
        >
          Add Event
        </button>
        <button
          onClick={() => {
            setShowPlacementForm(true);
            setShowEventForm(false);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
        >
          Add Placement
        </button>
      </div>

      {/* Event Form */}
      {showEventForm && (
        <form
          onSubmit={handleSubmitEvent(onSubmitEvent)}
          className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-5 mb-16"
        >
          <h2 className="text-2xl font-semibold text-sky-600">Add Event</h2>
          {message && <p className="text-green-600 font-medium text-center">{message}</p>}

          <input
            type="text"
            placeholder="Event Title"
            {...registerEvent('title', { required: true })}
            className="w-full border border-indigo-200 px-4 py-2 rounded-lg"
          />
          <input
            type="date"
            {...registerEvent('date', { required: true })}
            className="w-full border border-indigo-200 px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Location"
            {...registerEvent('location', { required: true })}
            className="w-full border border-indigo-200 px-4 py-2 rounded-lg"
          />
          <textarea
            rows={4}
            placeholder="Description"
            {...registerEvent('description', { required: true })}
            className="w-full border border-indigo-200 px-4 py-2 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg"
          >
            Submit Event
          </button>
        </form>
      )}

      {/* Placement Form */}
      {showPlacementForm && (
        <form
          onSubmit={handleSubmitPlacement(onSubmitPlacement)}
          className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-5 mb-16"
        >
          <h2 className="text-2xl font-semibold text-indigo-600">Add Placement</h2>
          {placementMessage && (
            <p className="text-green-600 font-medium text-center">{placementMessage}</p>
          )}
          <input
            type="text"
            placeholder="Company Name"
            {...registerPlacement('company', { required: true })}
            className="w-full border border-indigo-200 px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Branch"
            {...registerPlacement('branch', { required: true })}
            className="w-full border border-indigo-200 px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Package (e.g., 6 LPA)"
            {...registerPlacement('package', { required: true })}
            className="w-full border border-indigo-200 px-4 py-2 rounded-lg"
          />
          <input
            type="date"
            placeholder="Placement Date"
            {...registerPlacement('date', { required: true })}
            className="w-full border border-indigo-200 px-4 py-2 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
          >
            Submit Placement
          </button>
        </form>
      )}

      {/* Events List */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 mb-10">
        <h3 className="text-xl font-semibold text-sky-700 mb-4">📅 Events</h3>
        {storedEvents.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <ul className="space-y-4">
            {storedEvents.map((ev, idx) => (
              <li key={idx} className="border border-sky-100 p-4 rounded-lg">
                <p><strong>Title:</strong> {ev.title}</p>
                <p><strong>Date:</strong> {new Date(ev.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {ev.location}</p>
                <p><strong>Description:</strong> {ev.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Placements List */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">💼 Placements</h3>
        {storedPlacements.length === 0 ? (
          <p className="text-gray-500">No placements found.</p>
        ) : (
          <ul className="space-y-4">
            {storedPlacements.map((plc, idx) => (
              <li key={idx} className="border border-indigo-100 p-4 rounded-lg">
                <p><strong>Company:</strong> {plc.company}</p>
                <p><strong>Branch:</strong> {plc.branch}</p>
                <p><strong>Package:</strong> {plc.package}</p>
                <p><strong>Date:</strong> {new Date(plc.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
