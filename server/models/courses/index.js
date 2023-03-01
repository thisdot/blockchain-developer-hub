const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const COURSES = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const dbCOURSES = mongoose.models.courses || mongoose.model('courses', COURSES);

module.exports = dbCOURSES;
