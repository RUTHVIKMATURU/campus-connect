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

// Get command line arguments
const args = process.argv.slice(2);
const regNo = args[0];
const password = args[1];

if (!regNo || !password) {
  console.error('Usage: node verifyPassword.js <regNo> <password>');
  process.exit(1);
}

async function verifyPassword() {
  try {
    // Find student
    const student = await Student.findOne({ regNo });
    
    if (!student) {
      console.error(`❌ No student found with registration number: ${regNo}`);
      return;
    }
    
    console.log(`Found student: ${student.name} (${student.regNo})`);
    console.log(`Stored password hash: ${student.password.substring(0, 20)}...`);
    
    // Verify password
    const isMatch = await bcrypt.compare(password, student.password);
    
    if (isMatch) {
      console.log(`✅ Password verification SUCCESSFUL!`);
      console.log(`The password "${password}" is correct for ${student.name}.`);
    } else {
      console.log(`❌ Password verification FAILED!`);
      console.log(`The password "${password}" is NOT correct for ${student.name}.`);
      
      // Try hashing the password to see what it would look like
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(`If "${password}" was hashed now, it would look like: ${hashedPassword.substring(0, 20)}...`);
    }
  } catch (error) {
    console.error('Error verifying password:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
verifyPassword();
