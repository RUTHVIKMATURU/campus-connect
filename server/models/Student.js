const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  role: { type: String, enum: ['senior', 'junior'], required: true },
  status: { type: String, enum: ['placed', 'pursuing'], default: 'pursuing' },
  company: String,
  position: String,
  batch: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);