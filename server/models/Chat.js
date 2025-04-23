const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'Sender registration number is required'],
    ref: 'Student'
  },
  receiver: {
    type: String,
    required: [true, 'Receiver registration number is required'],
    ref: 'Student'
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for better query performance
chatMessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

// Virtual for chatRoomId
chatMessageSchema.virtual('chatRoomId').get(function() {
  return [this.sender, this.receiver].sort().join('_');
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);



