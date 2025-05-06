require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function addTestStudent() {
  try {
    // Test student data
    const regNo = 'TEST001';
    const plainPassword = regNo; // Password same as regNo
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ regNo });
    if (existingStudent) {
      console.log(`Student with regNo ${regNo} already exists. Deleting...`);
      await Student.deleteOne({ regNo });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    console.log('Creating test student with:');
    console.log(`- Registration Number: ${regNo}`);
    console.log(`- Password: ${plainPassword}`);
    console.log(`- Hashed Password: ${hashedPassword.substring(0, 20)}...`);
    
    // Create new student directly (bypassing mongoose hooks)
    const newStudent = {
      regNo,
      name: 'Test Student',
      email: 'test@example.com',
      password: hashedPassword,
      branch: 'Computer Science',
      year: '2nd',
      section: 'A',
      role: 'student',
      status: 'pursuing'
    };
    
    // Insert directly into database
    const result = await Student.create(newStudent);
    
    console.log('\n✅ Test student created successfully!');
    console.log(`Student ID: ${result._id}`);
    console.log(`You can now log in with:`);
    console.log(`- Registration Number: ${regNo}`);
    console.log(`- Password: ${plainPassword}`);
  } catch (error) {
    console.error('Error creating test student:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
addTestStudent();
