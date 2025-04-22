import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function Placement() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/placements');
        setPlacements(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching placements:', error);
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  if (loading)
    return <div className="text-center text-lg mt-8 text-blue-700 font-medium">Loading placements...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent mb-12">
          Placement Opportunities
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {placements.map((placement) => (
            <div key={placement.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{placement.company}</h3>
                  <p className="text-primary-600 font-medium">{placement.role}</p>
                </div>
                <span className="px-4 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                  {placement.type}
                </span>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>💰 Package: {placement.package}</p>
                <p>📍 Location: {placement.location}</p>
                <p>📅 Last Date: {placement.lastDate}</p>
              </div>
              <button className="mt-6 w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Placement;
