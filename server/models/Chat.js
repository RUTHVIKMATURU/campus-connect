const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // regNo
  receiver: { type: String, required: true }, // regNo
  message: { type: String, required: true },
  chatRoomId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);