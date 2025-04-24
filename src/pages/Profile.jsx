import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, GraduationCap, Users, Edit2, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const renderField = (icon, label, value, fieldName) => {
    return (
      <div className="flex items-center text-gray-600 border-b border-gray-200 pb-4">
        {icon}
        <span className="font-medium w-32">{label}:</span>
        {isEditing && fieldName !== 'role' && fieldName !== 'regNo' ? (
          <input
            type="text"
            name={fieldName}
            value={editedData[fieldName] || ''}
            onChange={handleChange}
            className="flex-1 px-3 py-1 border rounded-lg focus:ring-2 focus:ring-violet-500"
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 relative"
        >
          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="absolute top-4 right-4 p-2 text-violet-600 hover:bg-violet-50 rounded-full transition-colors"
            >
              <Edit2 size={20} />
            </button>
          )}

          {/* Profile Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center">
              <User size={40} className="text-violet-600" />
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
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

