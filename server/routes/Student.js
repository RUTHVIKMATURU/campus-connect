const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all seniors
router.get('/seniors', async (req, res) => {
  try {
    const seniors = await Student.find({ role: 'senior' })
      .sort({ createdAt: -1 });
    res.json(seniors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seniors', error });
  }
});

// Get student by regNo
router.get('/:regNo', async (req, res) => {
  try {
    const student = await Student.findOne({ regNo: req.params.regNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error });
  }
});

// Update student profile
router.put('/:regNo', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { regNo: req.params.regNo },
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
});

module.exports = router;