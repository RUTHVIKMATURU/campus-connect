const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

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
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: student._id, regNo: student.regNo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with _id included
    res.json({
      token,
      user: {
        _id: student._id, // Make sure to include the _id
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
      error: 'Login failed',
      details: error.message 
    });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { regNo, name, email, password, year, branch, section,role } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ regNo }, { email }] 
    });

    if (existingStudent) {
      return res.status(400).json({ 
        error: 'Registration number or email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new student
    const student = new Student({
      regNo,
      name,
      email,
      password: hashedPassword,
      year,
      branch,
      section,
      role
    });

    await student.save();

    // Generate token
    const token = jwt.sign(
      { id: student._id, regNo: student.regNo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
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
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
});

module.exports = router;
