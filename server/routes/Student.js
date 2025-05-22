const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcrypt'); // Changed from bcryptjs to bcrypt for consistency
const sendCredentialsEmail = require('../utils/emailService');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
      .select('-password') // Exclude password
      .sort({ year: 1, name: 1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// Get all seniors
router.get('/seniors', async (req, res) => {
  try {
    const seniors = await Student.find({ role: 'senior' })
      .select('-password') // Exclude password
      .sort({ year: 1, name: 1 });

    res.json(seniors);
  } catch (error) {
    console.error('Error in GET /students/seniors:', error); // Debug log
    res.status(500).json({
      success: false,
      message: 'Error fetching seniors',
      error: error.message
    });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('-password'); // Exclude password

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json(student);
  } catch (error) {
    console.error('Error in GET /students/:id:', error); // Debug log
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const studentData = req.body;

    // Generate default password (using registration number)
    const defaultPassword = studentData.regNo;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Create new student document
    // IMPORTANT: We're directly using the hashedPassword to avoid double-hashing
    // The pre-save hook in the Student model would hash it again if we provided plain text

    const newStudent = new Student({
      regNo: studentData.regNo,
      name: studentData.name,
      email: studentData.email,
      password: hashedPassword, // Already hashed password
      branch: studentData.branch,
      year: studentData.year,
      section: studentData.section,
      role: studentData.role || 'student',
      status: studentData.status || 'pursuing'
    });

    const savedStudent = await newStudent.save();
    const studentResponse = savedStudent.toObject();
    delete studentResponse.password;


    try {
      await sendCredentialsEmail(studentData.email, studentData.regNo, defaultPassword);

    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    res.status(201).json(studentResponse);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      message: 'Error creating student',
      error: error.message
    });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    // Find student first to check if exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update the student
    // Note: We're not allowing password updates through this route
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        regNo: updateData.regNo,
        name: updateData.name,
        email: updateData.email,
        branch: updateData.branch,
        year: updateData.year,
        section: updateData.section,
        role: updateData.role || 'student',
        status: updateData.status || 'pursuing'
      },
      { new: true }
    ).select('-password');

    res.json(updatedStudent);

  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating student'
    });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find student first to check if exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student has any associated data that should be deleted
    // For example, if you have experiences or other data linked to the student
    // You might want to delete those as well or handle them appropriately

    // Delete the student
    await Student.findByIdAndDelete(studentId);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting student'
    });
  }
});

// Update student profile
router.put('/profile/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    // Find student first to check if exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        name: updateData.name,
        email: updateData.email,
        branch: updateData.branch,
        year: updateData.year,
        section: updateData.section,
        role: updateData.role || student.role,
        status: updateData.status || student.status
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      student: updatedStudent
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
});

module.exports = router;


