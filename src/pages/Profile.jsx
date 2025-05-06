import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, GraduationCap, Users, Edit2, X, Check, Building2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '../theme/ThemeContext';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setEditedData(parsedUser);
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(user);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `http://localhost:5000/api/students/profile/${user._id}`,
        editedData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.student) {
        setUser(response.data.student);
        localStorage.setItem('user', JSON.stringify(response.data.student));
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setError('');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to update profile'
      );
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  const renderField = (icon, label, value, fieldName) => {
    return (
      <div className="flex items-center text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-4 transition-colors duration-300">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mr-3 transition-colors duration-300">
          {icon}
        </div>
        <span className="font-medium w-32">{label}:</span>
        {isEditing && fieldName !== 'role' && fieldName !== 'regNo' ? (
          <input
            type="text"
            name={fieldName}
            value={editedData[fieldName] || ''}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
          />
        ) : (
          <span className="font-medium">{value}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8 relative border border-gray-100 dark:border-gray-700 transition-all duration-300"
        >
          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="absolute top-4 right-4 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors duration-300"
            >
              <Edit2 size={20} />
            </button>
          )}

          {/* Profile Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-28 h-28 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 shadow-md dark:shadow-indigo-900/20 transition-colors duration-300">
              <User size={48} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{user.role === 'senior' ? 'Senior Student' : 'Student'}</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-100 dark:border-green-800/30 transition-colors duration-300">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800/30 transition-colors duration-300">
              {error}
            </div>
          )}

          {/* Profile Fields */}
          <div className="grid gap-6">
            {renderField(<User size={20} className="text-violet-500 mr-3" />, "Name", user.name, "name")}
            {renderField(<Mail size={20} className="text-violet-500 mr-3" />, "Email", user.email, "email")}
            {renderField(<BookOpen size={20} className="text-violet-500 mr-3" />, "Registration No", user.regNo, "regNo")}
            {renderField(<GraduationCap size={20} className="text-violet-500 mr-3" />, "Year", user.year, "year")}
            {renderField(<Users size={20} className="text-violet-500 mr-3" />, "Role", user.role, "role")}
            {renderField(<GraduationCap size={20} className="text-violet-500 mr-3" />, "Branch", user.branch, "branch")}
            {renderField(<GraduationCap size={20} className="text-violet-500 mr-3" />, "Section", user.section, "section")}
          </div>

          {/* Edit Mode Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <Check size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

