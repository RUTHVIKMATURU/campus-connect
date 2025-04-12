import { useEffect,useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !localStorage.getItem('token');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await axios.get('http://localhost:5000/api/experiences', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExperiences(res.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      if (error.response?.status === 401) navigate('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // redirect to login if not authenticated
    } else {
      fetchExperiences();
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/experiences', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      reset();
      setShowForm(false);
      fetchExperiences();
    } catch (error) {
      console.error('Error adding experience:', error);
      if (error.response?.status === 401) navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 to-sky-500 text-white py-12 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 drop-shadow-lg">Experiences</h1>

      {/* Experience Posts */}
      <div className="flex flex-col items-center gap-8 mb-10">
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-2xl"
          >
            <h3 className="text-xl font-semibold">{exp.role} @ {exp.company}</h3>
            <p className="text-sm text-gray-500">{exp.name} | {exp.duration}</p>
            <p className="mt-3">{exp.experienceText}</p>
          </div>
        ))}
      </div>

      {/* Show Add Experience button only if user is logged in */}
      {isLoggedIn && (
        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-sky-700 font-semibold px-6 py-2 rounded-md hover:bg-sky-100 shadow"
          >
            {showForm ? 'Cancel' : 'Add Experience'}
          </button>
        </div>
      )}

      {/* Show Form only when toggled and user is logged in */}
      {showForm && isLoggedIn && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white text-black rounded-lg p-6 max-w-2xl mx-auto mt-8 shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Add Experience</h2>

          <input
            type="text"
            placeholder="Name"
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            type="text"
            placeholder="Company"
            {...register('company', { required: 'Company is required' })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}

          <input
            type="text"
            placeholder="Role"
            {...register('role', { required: 'Role is required' })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

          <input
            type="text"
            placeholder="Duration (e.g. Jan 2024 - Mar 2024)"
            {...register('duration', { required: 'Duration is required' })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}

          <textarea
            placeholder="Your Experience"
            {...register('experienceText', { required: 'Experience text is required' })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.experienceText && <p className="text-red-500 text-sm">{errors.experienceText.message}</p>}

          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-2 rounded-md w-full"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
