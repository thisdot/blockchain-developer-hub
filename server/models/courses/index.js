const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const COURSES = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const dbCOURSES = mongoose.models.courses || mongoose.model('courses', COURSES);

module.exports = dbCOURSES;
