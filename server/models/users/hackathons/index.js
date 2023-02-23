const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const USERHACKATHONS = new Schema({
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

const dbUSERHACKATHONS = mongoose.models.userhackathons || mongoose.model('userhackathons', USERHACKATHONS);

module.exports = dbUSERHACKATHONS;
