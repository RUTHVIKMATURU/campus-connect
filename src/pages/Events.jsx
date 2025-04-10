import EventCard from '../components/EventCard';

export default function Events() {
  const events = [
    {
      title: 'Hackathon 2025',
      date: 'April 15, 2025',
      location: 'Tech Park Auditorium',
      description: 'Join the most exciting 24-hour coding challenge of the year!',
    },
    {
      title: 'Career Expo',
      date: 'April 22, 2025',
      location: 'Main Campus Hall B',
      description: 'Meet top companies and explore internship and job opportunities.',
    },
    {
      title: 'AI Workshop',
      date: 'May 3, 2025',
      location: 'Room 204, Innovation Block',
      description: 'Hands-on session on building smart applications using AI tools.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-pink-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-sky-800 mb-10">
        Upcoming Events 🎉
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {events.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            date={event.date}
            location={event.location}
            description={event.description}
          />
        ))}
      </div>
    </div>
  );
}
