import { CalendarClock, MapPin } from 'lucide-react';

export default function EventCard({ title, date, location, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-6 space-y-3 w-full max-w-md">
      <h2 className="text-xl font-bold text-sky-800">{title}</h2>
      <div className="flex items-center text-sm text-gray-600 gap-2">
        <CalendarClock size={16} className="text-sky-500" />
        <span>{date}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 gap-2">
        <MapPin size={16} className="text-pink-500" />
        <span>{location}</span>
      </div>
      <p className="text-gray-700 text-sm">{description}</p>
      <button className="mt-2 px-4 py-1 text-sm rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition">
        Register
      </button>
    </div>
  );
}
