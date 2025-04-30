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

    // Verify password
    const isValidPassword = await bcrypt.compare(password, student.password);

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

module.exports = router;
