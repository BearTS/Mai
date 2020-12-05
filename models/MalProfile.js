const mongoose = require('mongoose');

const mal = mongoose.Schema({
  userID: String,
  MALUser: {type: String, default: undefined},
  MALId: {type: String, default: null}
},{
  versionKey: false
});

module.exports = mongoose.model("MAL", mal);
