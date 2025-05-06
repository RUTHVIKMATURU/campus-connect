const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    required: [true, 'Branch is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'senior'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['pursuing', 'placed', 'graduated'],
    default: 'pursuing'
  }
}, {
  timestamps: true
});

// IMPORTANT: We're disabling the automatic password hashing in the pre-save hook
// because we're now handling the hashing directly in the routes
// This prevents double-hashing which can cause login issues

// For reference, here's the original pre-save hook:
/*
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
*/

// Instead, we'll just log the password length to help with debugging
studentSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    console.log('Student model pre-save hook - password length:', this.password.length);
    console.log('Password starts with:', this.password.substring(0, 10) + '...');
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);











