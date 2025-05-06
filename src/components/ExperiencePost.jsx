import { Briefcase, CalendarDays, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

export default function ExperiencePost({ id, role, company, date, description, experienceType }) {
  const { isDarkMode } = useTheme();

  const getExperienceTypeColor = (type) => {
    if (!type) return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';

    const colors = {
      'interview': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
      'hackathon': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      'coding-contest': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400',
      'internship': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      'workshop': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
      'placement': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400'
    };
    return colors[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  const formatExperienceType = (type) => {
    if (!type) return 'Experience';

    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Link to={`/experiences/${id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 p-6 space-y-4 w-full max-w-2xl cursor-pointer border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-400">{role}</h2>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getExperienceTypeColor(experienceType)}`}>
            {formatExperienceType(experienceType)}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
          <Briefcase size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span>{company}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
          <CalendarDays size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span>{date}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}
