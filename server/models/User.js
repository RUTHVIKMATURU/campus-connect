const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  regNo: { 
    type: String, 
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  year: { 
    type: String,
    required: [true, 'Year is required']
  },
  branch: { 
    type: String,
    required: [true, 'Branch is required']
  },
  section: { 
    type: String,
    required: [true, 'Section is required']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
