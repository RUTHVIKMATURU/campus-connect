const mongoose = require('mongoose');

const Placement = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  package: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Placement', Placement);
