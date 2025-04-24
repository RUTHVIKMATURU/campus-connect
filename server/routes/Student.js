const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs'); // Changed from bcrypt to bcryptjs
const sendCredentialsEmail = require('../utils/emailService');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
      .select('regNo name email branch year section role status')
      .sort({ year: 1, name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    // Check if email or regNo is being updated
    if (updateData.email || updateData.regNo) {
      const existingStudent = await Student.findOne({
        _id: { $ne: studentId }, // exclude current student
        $or: [
          { email: updateData.email },
          { regNo: updateData.regNo }
        ]
      });

      if (existingStudent) {
        return res.status(400).json({
          message: 'Email or Registration Number already exists for another student'
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating student', 
      error: error.message 
    });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

// Add new student
router.post('/', async (req, res) => {
  try {
    const studentData = req.body;
    
    // Validate required fields
    if (!studentData.regNo || !studentData.name || !studentData.email) {
      return res.status(400).json({ 
        message: 'Registration number, name, and email are required' 
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ regNo: studentData.regNo }, { email: studentData.email }] 
    });

    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student already exists with this registration number or email' 
      });
    }
    
    // Generate default password (using registration number)
    const defaultPassword = studentData.regNo;
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(defaultPassword, salt);

    // Create new student document
    const newStudent = new Student({
      regNo: studentData.regNo,
      name: studentData.name,
      email: studentData.email,
      password: hashedPassword,
      branch: studentData.branch,
      year: studentData.year,
      section: studentData.section,
      role: studentData.role || 'student',
      status: studentData.status || 'pursuing'
    });

    const savedStudent = await newStudent.save();

    // Remove password from response
    const studentResponse = savedStudent.toObject();
    delete studentResponse.password;

    try {
      // Send email to student with their credentials
      await sendCredentialsEmail(studentData.email, studentData.regNo, defaultPassword);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue with the response even if email fails
    }

    res.status(201).json({
      message: 'Student created successfully',
      student: studentResponse
    });

  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ 
      message: 'Error creating student', 
      error: error.message 
    });
  }
});

// Get all seniors
router.get('/seniors', async (req, res) => {
  try {
    const seniors = await Student.find({ 
      role: 'senior',
      status: { $ne: 'inactive' }  // Exclude inactive seniors
    })
    .select('name regNo branch year status company')
    .sort({ year: -1, name: 1 });
    
    res.json(seniors);
  } catch (error) {
    console.error('Error fetching seniors:', error);
    res.status(500).json({ 
      message: 'Error fetching seniors', 
      error: error.message 
    });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

    const student = await Student.findById(req.params.id)
      .select('name regNo branch year status company');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ 
      message: 'Error fetching student', 
      error: error.message 
    });
  }
});

// Get student by regNo or ID
router.get('/reg/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    if (!identifier) {
      return res.status(400).json({ 
        success: false,
        message: 'Identifier is required' 
      });
    }

    console.log('Searching for student with identifier:', identifier); // Debug log

    let student;
    
    // Check if the identifier is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      student = await Student.findById(identifier)
        .select('name regNo branch year status company')
        .lean();
    } else {
      // If not a valid ObjectId, search by regNo
      student = await Student.findOne({ regNo: identifier })
        .select('name regNo branch year status company')
        .lean();
    }
    
    if (!student) {
      console.log('No student found with identifier:', identifier); // Debug log
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }
    
    console.log('Found student:', student); // Debug log
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching student', 
      error: error.message 
    });
  }
});

// Update profile
router.put('/profile/:id', async (req, res) => {
  try {
    const studentId = req.params.id;

    // Better ID validation with specific error message
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        message: `Invalid student ID format: ${studentId}`
      });
    }

    const updateData = req.body;

    // Remove sensitive fields from update data
    const sanitizedData = { ...updateData };
    delete sanitizedData.password;
    delete sanitizedData._id;
    delete sanitizedData.role;

    // Check if email is being updated
    if (sanitizedData.email) {
      const existingStudent = await Student.findOne({
        _id: { $ne: studentId },
        email: sanitizedData.email
      });

      if (existingStudent) {
        return res.status(400).json({
          message: 'Email already exists'
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: sanitizedData },
      { 
        new: true, 
        runValidators: true,
        select: '-password'
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ 
        message: 'Student not found' 
      });
    }

    res.json({
      message: 'Profile updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ 
      message: error.message || 'Error updating profile'
    });
  }
});

module.exports = router;










