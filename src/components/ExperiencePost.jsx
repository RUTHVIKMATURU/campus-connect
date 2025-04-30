import { Briefcase, CalendarDays, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExperiencePost({ id, role, company, date, description, experienceType }) {
  const getExperienceTypeColor = (type) => {
    const colors = {
      'interview': 'bg-blue-100 text-blue-800',
      'hackathon': 'bg-green-100 text-green-800',
      'coding-contest': 'bg-primary-100 text-primary-800',
      'internship': 'bg-yellow-100 text-yellow-800',
      'workshop': 'bg-accent-100 text-accent-800',
      'placement': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatExperienceType = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Link to={`/experiences/${id}`}>
      <div className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 p-6 space-y-4 w-full max-w-2xl cursor-pointer">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-primary-800">{role}</h2>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getExperienceTypeColor(experienceType)}`}>
            {formatExperienceType(experienceType)}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 gap-2">
          <Briefcase size={16} className="text-primary-500" />
          <span>{company}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 gap-2">
          <CalendarDays size={16} className="text-accent-500" />
          <span>{date}</span>
        </div>
        <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}
