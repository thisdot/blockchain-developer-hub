const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TUTORIALS = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
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

const dbTUTORIALS = mongoose.models.tutorials || mongoose.model('tutorials', TUTORIALS);

module.exports = dbTUTORIALS;
