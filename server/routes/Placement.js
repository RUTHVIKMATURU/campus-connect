const express = require('express');
const router = express.Router();
const Placement = require('../models/Placement'); 

// GET all placements
router.get('/', async (req, res) => {
  try {
    const placements = await Placement.find();
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new placement
router.post('/', async (req, res) => {
  const { branch, company, package, date } = req.body;

  // Validation
  if (!branch || !company || !package || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newPlacement = new Placement({
      branch,
      company,
      package,
      date
    });

    const savedPlacement = await newPlacement.save();
    res.status(201).json(savedPlacement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save placement' });
  }
});

module.exports = router;
