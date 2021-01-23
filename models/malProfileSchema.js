const mongoose = require('mongoose');

const moneySchema = mongoose.Schema({

  userID: String,
  MALUser: {type: String, default: undefined},
  MALId: {type: String, default: null}

});

module.exports = mongoose.model("MAL",moneySchema);
