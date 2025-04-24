const express =require('express');
const Experience=require('../models/Experience.js');

const router = express.Router();

// POST: Submit an experience
router.post('/', async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).json({ message: 'Experience submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving experience', error });
  }
});

// GET: Fetch all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiences', error });
  }
});

// GET: Fetch single experience by ID
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experience', error });
  }
});

module.exports = router;
