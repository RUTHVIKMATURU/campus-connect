const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary, storage } = require('../config/cloudinary');
const Event = require('../models/Event');

// Multer configuration with Cloudinary
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

// Create new event
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: 'Error uploading file',
        error: err.message 
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'Please upload an image' 
        });
      }

      const newEvent = new Event({
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        venue: req.body.venue,
        imageUrl: req.file.path
      });

      await newEvent.save();
      
      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        event: newEvent
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error creating event',
        error: error.message 
      });
    }
  });
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .select('-__v');
    
    res.json({
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      error: 'Error fetching events'
    });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .select('-__v');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching event',
      error: error.message 
    });
  }
});

// Update event
router.put('/:id', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: 'Error uploading file',
        error: err.message 
      });
    }

    try {
      const eventId = req.params.id;
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        venue: req.body.venue,
      };

      // Only update image if a new one is uploaded
      if (req.file) {
        updateData.imageUrl = req.file.path;
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        updateData,
        { new: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      res.json({
        success: true,
        message: 'Event updated successfully',
        event: updatedEvent
      });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating event',
        error: error.message
      });
    }
  });
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (event.imageUrl) {
      const publicId = event.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
});

module.exports = router;




