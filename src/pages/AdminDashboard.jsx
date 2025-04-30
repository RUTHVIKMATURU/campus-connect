import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { Trash2, Edit, Loader } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

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

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {message.text && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-center text-sky-700 drop-shadow-sm">
        Admin Dashboard
      </h1>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (editingStudent) resetForm();
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
          >
            {showAddForm ? 'Cancel' : 'Add New Student'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <form 
            onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
            className="bg-white shadow-md rounded-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="regNo"
                placeholder="Registration Number"
                value={formData.regNo}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2"
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2"
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="year"
                placeholder="Year"
                value={formData.year}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={formData.section}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2"
              >
                <option value="student">Student</option>
                <option value="senior">Senior</option>
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2"
              >
                <option value="pursuing">Pursuing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
              >
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        )}

        {/* Students Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{student.regNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => startEditing(student)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        disabled={deletingStudentId === student._id}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setStudentToDelete(student);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
