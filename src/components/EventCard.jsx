export default function EventCard({ title, date, location, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 space-y-4 w-full max-w-md border border-gray-100 hover:border-sky-300">
      {/* Title */}
      <h2 className="text-2xl font-extrabold text-sky-800 tracking-tight">
        {title}
      </h2>

      {/* Date */}
      <div className="flex items-start text-sm text-gray-700">
        <span className="font-semibold text-sky-600 mr-2">Date:</span>
        <span>{date}</span>
      </div>

      {/* Location */}
      <div className="flex items-start text-sm text-gray-700">
        <span className="font-semibold text-pink-600 mr-2">Location:</span>
        <span>{location}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
