require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function addTestEvent() {
  try {
    // Test event data
    const eventData = {
      title: 'Campus Tech Fest 2023',
      description: 'Join us for a day of technology workshops, coding competitions, and networking with industry professionals. This event is perfect for students interested in software development, AI, and emerging technologies.',
      date: new Date('2023-11-15'),
      venue: 'Main Auditorium',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    };
    
    // Create new event
    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();
    
    console.log('\n✅ Test event created successfully!');
    console.log(`Event ID: ${savedEvent._id}`);
    console.log(`Title: ${savedEvent.title}`);
    console.log(`Date: ${savedEvent.date}`);
    console.log(`Venue: ${savedEvent.venue}`);
    
    // Add a second event
    const eventData2 = {
      title: 'Career Development Workshop',
      description: 'Prepare for your future career with our comprehensive workshop. Learn about resume building, interview techniques, and how to stand out in the job market. Industry experts will share their insights and provide personalized feedback.',
      date: new Date('2023-12-05'),
      venue: 'Conference Hall B',
      imageUrl: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    };
    
    const newEvent2 = new Event(eventData2);
    const savedEvent2 = await newEvent2.save();
    
    console.log('\n✅ Second test event created successfully!');
    console.log(`Event ID: ${savedEvent2._id}`);
    console.log(`Title: ${savedEvent2.title}`);
    
  } catch (error) {
    console.error('Error creating test event:', error);
  } finally {
    mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the function
addTestEvent();
