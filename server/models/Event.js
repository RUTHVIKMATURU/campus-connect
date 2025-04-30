const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
