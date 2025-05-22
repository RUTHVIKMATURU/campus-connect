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

      // Determine status based on date
      const eventDate = new Date(req.body.date);
      const now = new Date();
      const oneDayLater = new Date(now);
      oneDayLater.setDate(oneDayLater.getDate() + 1);

      let status;
      if (eventDate < now) {
        status = 'past';
      } else if (eventDate >= now && eventDate < oneDayLater) {
        status = 'ongoing';
      } else {
        status = 'upcoming';
      }

      const newEvent = new Event({
        title: req.body.title,
        description: req.body.description,
        date: eventDate,
        venue: req.body.venue,
        imageUrl: req.file.path,
        category: req.body.category || 'workshop',
        status: status
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

// Helper function to update event status and category
const updateEventStatus = async () => {
  try {
    const now = new Date();

    // First, ensure all events have status and category fields
    await Event.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'upcoming' } }
    );

    await Event.updateMany(
      { category: { $exists: false } },
      { $set: { category: 'workshop' } }
    );

    // Set past events
    const pastResult = await Event.updateMany(
      { date: { $lt: now }, status: { $ne: 'past' } },
      { $set: { status: 'past' } }
    );

    // Set ongoing events (assuming events last for 24 hours)
    const oneDayLater = new Date(now);
    oneDayLater.setDate(oneDayLater.getDate() + 1);

    const ongoingResult = await Event.updateMany(
      {
        date: { $gte: now, $lt: oneDayLater },
        status: { $ne: 'ongoing' }
      },
      { $set: { status: 'ongoing' } }
    );

    // Set upcoming events
    const upcomingResult = await Event.updateMany(
      {
        date: { $gte: oneDayLater },
        status: { $ne: 'upcoming' }
      },
      { $set: { status: 'upcoming' } }
    );

  } catch (error) {
    console.error('Error updating event statuses:', error);
  }
};

// Get all events
router.get('/', async (req, res) => {
  try {
    // Update event statuses automatically
    await updateEventStatus();

    const { category, status, search } = req.query;

    // Build filter object
    const filter = {};

    // Add category filter if provided
    if (category) {
      filter.category = category;
    }

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Add search filter if provided
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter)
      .sort({ date: -1 })
      .select('-__v');

    // Return events directly to match the format expected by the frontend
    res.json(events);
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
    // Update event statuses automatically
    await updateEventStatus();

    const event = await Event.findById(req.params.id)
      .select('-__v');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Return the event directly to match the format expected by the frontend
    res.json(event);
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
      // Determine status based on date
      const eventDate = new Date(req.body.date);
      const now = new Date();
      const oneDayLater = new Date(now);
      oneDayLater.setDate(oneDayLater.getDate() + 1);

      let status;
      if (eventDate < now) {
        status = 'past';
      } else if (eventDate >= now && eventDate < oneDayLater) {
        status = 'ongoing';
      } else {
        status = 'upcoming';
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        date: eventDate,
        venue: req.body.venue,
        category: req.body.category || 'workshop',
        status: status
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




