require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
