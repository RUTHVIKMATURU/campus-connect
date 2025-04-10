import { Briefcase, CalendarDays } from 'lucide-react';

export default function ExperiencePost({ role, company, date, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-6 space-y-3 w-full max-w-2xl">
      <h2 className="text-xl font-semibold text-violet-700">{role}</h2>
      <div className="flex items-center text-sm text-gray-600 gap-2">
        <Briefcase size={16} className="text-violet-500" />
        <span>{company}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 gap-2">
        <CalendarDays size={16} className="text-pink-500" />
        <span>{date}</span>
      </div>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
}
