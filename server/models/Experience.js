const mongoose =require('mongoose');

const experienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  experienceText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports= mongoose.model('Experience', experienceSchema);

