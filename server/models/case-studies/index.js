const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CASESTUDIES = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
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

const dbCASESTUDIES = mongoose.models.casestudies || mongoose.model('casestudies', CASESTUDIES);

module.exports = dbCASESTUDIES;
