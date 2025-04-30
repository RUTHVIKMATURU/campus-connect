const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcryptjs = require('bcryptjs');
const sendCredentialsEmail = require('../utils/emailService');

// Get all students
router.get('/', async (req, res) => {
  try {
    console.log('Fetching students...'); // Debug log
    const students = await Student.find()
      .select('-password') // Exclude password
      .sort({ year: 1, name: 1 });
    
    console.log(`Found ${students.length} students`); // Debug log
    
    res.json(students);
  } catch (error) {
    console.error('Error in GET /students:', error); // Debug log
    res.status(500).json({ 
      success: false,
      message: 'Error fetching students', 
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

module.exports = router;


