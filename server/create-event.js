require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

// Hardcode the MongoDB URI
const MONGO_URI = 'mongodb://127.0.0.1:27017/campus-connect';

console.log('Attempting to connect to MongoDB...');
console.log('MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');

    try {
      // Create a new event
      const newEvent = new Event({
        title: 'Campus Tech Fest 2023',
        description: 'Join us for a day of technology workshops, coding competitions, and networking with industry professionals.',
        date: new Date('2023-11-15'),
        venue: 'Main Auditorium',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
      });

      const savedEvent = await newEvent.save();
      console.log('Event created successfully:', savedEvent);

      // Create another event
      const newEvent2 = new Event({
        title: 'Career Development Workshop',
        description: 'Prepare for your future career with our comprehensive workshop on resume building and interview techniques.',
        date: new Date('2023-12-05'),
        venue: 'Conference Hall B',
        imageUrl: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
      });

      const savedEvent2 = await newEvent2.save();
      console.log('Event 2 created successfully:', savedEvent2);

      // Create a third event
      const newEvent3 = new Event({
        title: 'Convergence 2k25',
        description: 'The annual technical and cultural festival of our college. Participate in various competitions and workshops.',
        date: new Date('2025-03-15'),
        venue: 'College Campus',
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
      });

      const savedEvent3 = await newEvent3.save();
      console.log('Event 3 created successfully:', savedEvent3);

    } catch (error) {
      console.error('Error creating events:', error);
    } finally {
      mongoose.disconnect();
      console.log('MongoDB disconnected');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
