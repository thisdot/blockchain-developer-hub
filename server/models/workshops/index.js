const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WORKSHOPS = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
  },
  href: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const dbWORKSHOPS = mongoose.models.workshops || mongoose.model('workshops', WORKSHOPS);

module.exports = dbWORKSHOPS;
