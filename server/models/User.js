const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  year: String,
  branch: String,
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
