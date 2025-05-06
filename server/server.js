const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const eventRoutes = require('./routes/Event');
const studentRoutes = require('./routes/Student');
const authRoutes = require('./routes/Auth');
const chatRoutes = require('./routes/Chat');
const experienceRoutes = require('./routes/Experience');

// Register routes
app.use('/api/events', eventRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/experiences', experienceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Hardcode the MongoDB URI
const MONGO_URI = 'mongodb://127.0.0.1:27017/campus-connect';

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    // Start server only after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


