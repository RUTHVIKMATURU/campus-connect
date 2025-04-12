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
module.exports=router
