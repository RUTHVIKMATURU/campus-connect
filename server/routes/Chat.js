const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/Chat');

// Send message
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const chatRoomId = [sender, receiver].sort().join('_');
    
    const newMessage = new ChatMessage({
      sender,
      receiver,
      message,
      chatRoomId
    });
    
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});

// Get chat messages between two users
router.get('/:chatRoomId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      chatRoomId: req.params.chatRoomId
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

module.exports = router;