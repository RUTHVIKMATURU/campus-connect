const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required']
  },
  year: {
    type: String,
    required: [true, 'Year is required']
  },
  section: {
    type: String,
    required: [true, 'Section is required']
  },
  role: {
    type: String,
    enum: ['student', 'senior'],
    default: 'student'
  },
  status: {
    type: String,
    default: 'pursuing'
  },
  batch: String,
  company: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);









