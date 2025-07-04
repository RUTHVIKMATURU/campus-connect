const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/Chat');
const GroupChatMessage = require('../models/GroupChat');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// Get all messages for a senior
router.get('/senior-messages/:seniorRegNo', auth, async (req, res) => {
  try {
    const { seniorRegNo } = req.params;
    console.log('Fetching messages for senior:', seniorRegNo);

    if (!seniorRegNo) {
      return res.status(400).json({
        success: false,
        message: 'Senior registration number is required'
      });
    }

    // First, find all unique students who have chatted with this senior
    const uniqueStudents = await ChatMessage.distinct('sender', {
      receiver: seniorRegNo
    });

    // Add messages where senior is the sender
    const uniqueReceivers = await ChatMessage.distinct('receiver', {
      sender: seniorRegNo
    });

    // Combine unique students (remove duplicates)
    const allUniqueStudents = [...new Set([...uniqueStudents, ...uniqueReceivers])];

    // Filter out the senior's own regNo
    const studentRegNos = allUniqueStudents.filter(regNo => regNo !== seniorRegNo);
    console.log('Found student reg numbers:', studentRegNos);

    // Get student details for all chatters
    const students = await Student.find({
      regNo: { $in: studentRegNos }
    }).select('name regNo branch year _id');
    console.log('Found students:', students.length);

    // Get all messages for each student
    const conversations = await Promise.all(
      students.map(async (student) => {
        const messages = await ChatMessage.find({
          $or: [
            { sender: seniorRegNo, receiver: student.regNo },
            { sender: student.regNo, receiver: seniorRegNo }
          ]
        }).sort({ createdAt: -1 });

        return {
          student,
          messages
        };
      })
    );

    console.log('Returning conversations:', conversations.length);
    res.json(conversations);

  } catch (error) {
    console.error('Error fetching senior messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// Get chat messages
router.get('/:chatRoomId', async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    if (!chatRoomId) {
      return res.status(400).json({
        success: false,
        message: 'Chat room ID is required'
      });
    }

    console.log('Fetching messages for chatRoom:', chatRoomId); // Debug log

    const [user1RegNo, user2RegNo] = chatRoomId.split('_');

    if (!user1RegNo || !user2RegNo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat room ID format'
      });
    }

    // Find messages
    const messages = await ChatMessage.find({
      $or: [
        { sender: user1RegNo, receiver: user2RegNo },
        { sender: user2RegNo, receiver: user1RegNo }
      ]
    })
    .sort({ createdAt: 1 })
    .lean(); // Use lean() for better performance

    console.log(`Found ${messages.length} messages`); // Debug log

    // Return just the messages array instead of wrapping it in success/data
    res.json(messages);

  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Validate input
    if (!sender || !receiver || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify both users exist
    const [senderUser, receiverUser] = await Promise.all([
      Student.findOne({ regNo: sender }),
      Student.findOne({ regNo: receiver })
    ]);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({
        success: false,
        message: 'Sender or receiver not found'
      });
    }

    // Create and save message
    const newMessage = new ChatMessage({
      sender,
      receiver,
      message: message.trim()
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Group Chat Routes

// Get all group chat messages
router.get('/group/messages', auth, async (req, res) => {
  try {
    // Get the most recent messages, limited to 50 by default
    const limit = parseInt(req.query.limit) || 50;

    const messages = await GroupChatMessage.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Return in reverse order so newest are at the bottom
    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching group messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group messages',
      error: error.message
    });
  }
});

// Send a group chat message
router.post('/group/message', auth, async (req, res) => {
  try {
    const { sender, text, parentId } = req.body;

    // Validate input
    if (!sender || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify sender exists
    const senderUser = await Student.findOne({ regNo: sender });

    if (!senderUser) {
      return res.status(404).json({
        success: false,
        message: 'Sender not found'
      });
    }

    // Create message object
    const messageData = {
      sender,
      text: text.trim(),
    };

    // Add parentId if it exists (for replies)
    if (parentId) {
      // Verify parent message exists
      const parentMessage = await GroupChatMessage.findById(parentId);
      if (!parentMessage) {
        return res.status(404).json({
          success: false,
          message: 'Parent message not found'
        });
      }
      messageData.parentId = parentId;
    }

    // Create and save message
    const newMessage = new GroupChatMessage(messageData);
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Send group message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

