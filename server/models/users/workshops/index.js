const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const USERWORKSHOPS = new Schema({
  userID: {
    type: ObjectId,
    required: true,
  },
  favourites: {
    type: Array({ title: String }),
    default: [],
  },
  read: {
    type: Array({ title: String }),
    default: [],
  },
});

const dbUSERWORKSHOPS = mongoose.models.userworkshops || mongoose.model('userworkshops', USERWORKSHOPS);

module.exports = dbUSERWORKSHOPS;
