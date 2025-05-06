import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { Trash2, Edit, Loader } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { useTheme } from '../theme/ThemeContext';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    regNo: '',
    name: '',
    email: '',
    branch: '',
    year: '',
    section: '',
    role: 'student',
    status: 'pursuing'
  });
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Check admin authentication
    const isAdmin = localStorage.getItem('isAdmin');
    const token = localStorage.getItem('token');

    if (!isAdmin || !token) {
      navigate('/admin-login');
      return;
    }

    fetchStudents();
  }, [navigate]);

  // Fetch students with authentication
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/students');
      setStudents(response || []); // axiosInstance automatically returns response.data.data
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to fetch students');
      setLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('Error:', error);
    if (error.response?.status === 401) {
      localStorage.clear();
      navigate('/admin-login');
      return;
    }
    setError(error.message || 'An error occurred');
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      regNo: '',
      name: '',
      email: '',
      branch: '',
      year: '',
      section: '',
      role: 'student',
      status: 'pursuing'
    });
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosInstance.post('/students', formData);
      setMessage({
        type: 'success',
        text: 'Student added successfully'
      });
      setStudents(prev => [...prev, response.data]);
      resetForm();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to add student'
      });
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosInstance.put(
        `/students/${editingStudent._id}`,
        formData
      );

      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Student updated successfully'
        });

        // Update the students array with the new data
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student._id === editingStudent._id ? response.student : student
          )
        );

        resetForm();
      } else {
        throw new Error(response.message || 'Failed to update student');
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update student'
      });
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/students/${studentId}`);

      if (response.success) {
        setStudents(prev => prev.filter(student => student._id !== studentId));
        setMessage({
          type: 'success',
          text: 'Student deleted successfully'
        });
      } else {
        throw new Error(response.message || 'Failed to delete student');
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to delete student'
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const startEditing = (student) => {
    setEditingStudent(student);
    setFormData({
      regNo: student.regNo,
      name: student.name,
      email: student.email,
      branch: student.branch,
      year: student.year,
      section: student.section,
      role: student.role || 'student',
      status: student.status || 'pursuing'
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-red-600 dark:text-red-400 text-xl font-semibold mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 shadow-md dark:shadow-indigo-900/30"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg shadow-md ${
          message.type === 'success'
            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/30'
            : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30'
        }`}>
          {message.text}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700 dark:text-indigo-400 drop-shadow-sm">
        Admin Dashboard
      </h1>


      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (editingStudent) resetForm();
            }}
            className={`${
              showAddForm
                ? 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600'
                : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600'
            } text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md dark:shadow-gray-900/30 font-medium flex items-center gap-2`}
          >
            {showAddForm ? (
              'Cancel'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Student
              </>
            )}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <form
            onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
            className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>

            {!editingStudent && (
              <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                  <strong>Note:</strong> When adding a new student, their initial password will be set to their registration number.
                  An email with login credentials will be sent to the provided email address.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Number</label>
                <input
                  type="text"
                  name="regNo"
                  placeholder="e.g., 2023001"
                  value={formData.regNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g., student@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  placeholder="e.g., Computer Science"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  placeholder="e.g., 2nd"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                <input
                  type="text"
                  name="section"
                  placeholder="e.g., A"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="student">Student</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="pursuing">Pursuing</option>
                  <option value="completed">Completed</option>
                  <option value="placed">Placed</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md dark:shadow-indigo-900/30"
              >
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        )}

        {/* Students Table */}
        <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reg No</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{student.regNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{student.branch}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{student.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => startEditing(student)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={deletingStudentId === student._id}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setStudentToDelete(student);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setStudentToDelete(null);
        }}
        onConfirm={() => handleDeleteStudent(studentToDelete?._id)}
        title="Delete Student"
        message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminDashboard;
