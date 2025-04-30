const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: function() {
      return ['interview', 'internship', 'placement'].includes(this.experienceType);
    }
  },
  role: {
    type: String,
    required: true,
    enum: [
      'participant', 'volunteer', 'organizer',
      'intern', 'full-time',
      'software-intern', 'data-intern', 'design-intern', 'other-intern',
      'software-engineer', 'data-scientist', 'product-manager', 'other'
    ]
  },
  customRole: {
    type: String,
    required: function() {
      return this.role === 'other' || this.role === 'other-intern';
    }
  },
  duration: {
    type: String,
    required: true,
  },
  experienceType: {
    type: String,
    required: true,
    enum: ['interview', 'hackathon', 'coding-contest', 'internship', 'workshop', 'placement']
  },
  experienceText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Experience', experienceSchema);

