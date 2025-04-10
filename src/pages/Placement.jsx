import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  if (loading) return <div className="text-center text-lg mt-8">Loading placements...</div>;

  return (
    <div className="p-6 bg-[#f4f7fa] min-h-screen">
      <h2 className="text-3xl font-semibold text-[#1a365d] mb-6 text-center">Recent or Upcoming Placements</h2>
      {placements.length === 0 ? (
        <p className="text-center text-gray-600">No placements found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {placements.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-[#1a365d] transition-transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-[#1a365d]">{p.name}</h3>
              <p className="text-gray-600 mt-1"><span className="font-semibold">Branch:</span> {p.branch}</p>
              <p className="text-gray-600"><span className="font-semibold">Company:</span> {p.company}</p>
              <p className="text-gray-600"><span className="font-semibold">Package:</span> {p.package} LPA</p>
              <p className="text-gray-500 text-sm mt-2">{new Date(p.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Placement;
