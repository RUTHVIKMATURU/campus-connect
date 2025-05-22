const mongoose = require('mongoose');

const groupChatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'Sender registration number is required'],
    ref: 'Student'
  },
  text: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  parentId: {
    type: String,
    default: null
  }
});

// Index for better query performance
groupChatMessageSchema.index({ createdAt: -1 });
groupChatMessageSchema.index({ parentId: 1 });

module.exports = mongoose.model('GroupChatMessage', groupChatMessageSchema);
