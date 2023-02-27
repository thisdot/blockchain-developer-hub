const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const USERCASESTUDIES = new Schema({
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

const dbUSERCASESTUDIES = mongoose.models.usercasestudies || mongoose.model('usercasestudies', USERCASESTUDIES);

module.exports = dbUSERCASESTUDIES;
