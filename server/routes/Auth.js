const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { regNo, password } = req.body;

    // Validate input
    if (!regNo || !password) {
      return res.status(400).json({
        error: 'Please provide both registration number and password'
      });
    }

    // Find student
    const student = await Student.findOne({ regNo });

    if (!student) {
      return res.status(401).json({
        error: 'Invalid registration number or password'
      });
    }

    

    // For debugging, let's try both ways of comparing
    const isValidPassword = await bcrypt.compare(password, student.password);
    
    // Let's also try to hash the provided password and compare the hashes directly
    const salt = await bcrypt.genSalt(12);
    const hashedProvidedPassword = await bcrypt.hash(password, salt);
    
    // Note: Direct comparison of hashes won't work because bcrypt generates different hashes
    // even for the same password due to different salts, which is why we use bcrypt.compare()

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid registration number or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: student._id, regNo: student.regNo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      user: {
        _id: student._id,
        regNo: student.regNo,
        name: student.name,
        email: student.email,
        year: student.year,
        branch: student.branch,
        section: student.section,
        role: student.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed. Please try again.'
    });
  }
});

// Special debug route for direct login with registration number
// This bypasses password verification for testing purposes
router.post('/debug-login', async (req, res) => {
  try {
    const { regNo } = req.body;

    if (!regNo) {
      return res.status(400).json({ error: 'Please provide registration number' });
    }

    // Find student
    const student = await Student.findOne({ regNo });

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    console.log('Debug login for student:', {
      regNo: student.regNo,
      name: student.name,
      passwordLength: student.password.length
    });

    // Generate token without password verification
    const token = jwt.sign(
      { id: student._id, regNo: student.regNo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      user: {
        _id: student._id,
        regNo: student.regNo,
        name: student.name,
        email: student.email,
        year: student.year,
        branch: student.branch,
        section: student.section,
        role: student.role
      }
    });
  } catch (error) {
    console.error('Debug login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

module.exports = router;
