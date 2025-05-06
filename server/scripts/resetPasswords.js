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

async function resetAllPasswords() {
  try {
    // Get all students
    const students = await Student.find({});
    console.log(`Found ${students.length} students`);

    // Process each student
    for (const student of students) {
      // Set password to match registration number
      const plainPassword = student.regNo;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      
      console.log(`Resetting password for ${student.name} (${student.regNo})`);
      console.log(`- Original password hash: ${student.password.substring(0, 20)}...`);
      console.log(`- New password hash: ${hashedPassword.substring(0, 20)}...`);
      
      // Update the password directly in the database (bypassing mongoose hooks)
      await Student.updateOne(
        { _id: student._id },
        { $set: { password: hashedPassword } }
      );
      
      console.log(`✅ Password reset for ${student.regNo}`);
    }

    console.log('\nAll passwords have been reset successfully!');
    console.log('Students can now log in using their registration number as password.');
  } catch (error) {
    console.error('Error resetting passwords:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
resetAllPasswords();
