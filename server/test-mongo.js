require('dotenv').config();
const mongoose = require('mongoose');

// Hardcode the MongoDB URI
const MONGO_URI = 'mongodb://127.0.0.1:27017/campus-connect';

console.log('Attempting to connect to MongoDB...');
console.log('MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
