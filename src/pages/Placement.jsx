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
    <div className="p-6 md:p-10 bg-gradient-to-br from-blue-50 to-pink-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-sky-800 mb-12 drop-shadow">
        Recent & Upcoming Placements
      </h2>

      {placements.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No placements found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {placements.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-3xl shadow-xl p-6 border-b-4 border-sky-500 hover:border-pink-400 hover:shadow-2xl transform transition duration-300 hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-sky-700 mb-2">{p.name}</h3>
              
              <p className="text-gray-700 mb-1"><span className="font-semibold text-sky-600">Company:</span> {p.company}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold text-sky-600">Branch:</span> {p.branch}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold text-sky-600">Package:</span> {p.package}</p>
              <p className="text-gray-500 text-sm mt-3 italic">
                {new Date(p.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Placement;
