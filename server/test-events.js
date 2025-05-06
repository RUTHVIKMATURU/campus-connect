require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

console.log('Attempting to connect to MongoDB...');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    try {
      // Check if there are any events
      const events = await Event.find();
      console.log(`Found ${events.length} events`);
      
      if (events.length === 0) {
        console.log('Creating test events...');
        
        // Create test events
        const testEvents = [
          {
            title: 'Campus Tech Fest 2023',
            description: 'Join us for a day of technology workshops, coding competitions, and networking with industry professionals.',
            date: new Date('2023-11-15'),
            venue: 'Main Auditorium',
            imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
          },
          {
            title: 'Career Development Workshop',
            description: 'Prepare for your future career with our comprehensive workshop on resume building and interview techniques.',
            date: new Date('2023-12-05'),
            venue: 'Conference Hall B',
            imageUrl: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
          }
        ];
        
        for (const eventData of testEvents) {
          const newEvent = new Event(eventData);
          await newEvent.save();
          console.log(`Created event: ${newEvent.title}`);
        }
        
        // Verify events were created
        const createdEvents = await Event.find();
        console.log(`Now there are ${createdEvents.length} events`);
      } else {
        console.log('Events already exist in the database:');
        events.forEach((event, index) => {
          console.log(`${index + 1}. ${event.title} (${event._id})`);
        });
      }
    } catch (error) {
      console.error('Error working with events:', error);
    } finally {
      mongoose.disconnect();
      console.log('MongoDB disconnected');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
