import { Briefcase, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExperiencePost({ id, role, company, date, description }) {
  return (
    <Link to={`/experiences/${id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-6 space-y-3 w-full max-w-2xl cursor-pointer">
        <h2 className="text-xl font-semibold text-violet-700">{role}</h2>
        <div className="flex items-center text-sm text-gray-600 gap-2">
          <Briefcase size={16} className="text-violet-500" />
          <span>{company}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 gap-2">
          <CalendarDays size={16} className="text-pink-500" />
          <span>{date}</span>
        </div>
        <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}
