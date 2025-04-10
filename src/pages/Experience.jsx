import ExperiencePost from '../components/ExperiencePost';

export default function Experience() {
  const experiences = [
    {
      role: 'Frontend Developer Intern',
      company: 'TechNova Solutions',
      date: 'Jan 2024 - Mar 2024',
      description:
        'Worked on a React-based dashboard for managing e-commerce analytics. Optimized UI/UX and added responsive design using Tailwind CSS.',
    },
    {
      role: 'Campus Ambassador',
      company: 'CodeFest',
      date: 'Aug 2023 - Dec 2023',
      description:
        'Promoted events and handled student queries, increasing campus participation by 45% through consistent outreach.',
    },
    {
      role: 'Open Source Contributor',
      company: 'Hacktoberfest',
      date: 'Oct 2023',
      description:
        'Contributed to multiple beginner-friendly open source repositories focused on web development and automation tools.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 to-sky-500 text-white py-12 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 drop-shadow-lg">
        Experiences 💼
      </h1>
      <div className="flex flex-col items-center gap-8">
        {experiences.map((exp, index) => (
          <ExperiencePost
            key={index}
            role={exp.role}
            company={exp.company}
            date={exp.date}
            description={exp.description}
          />
        ))}
      </div>
    </div>
  );
}
