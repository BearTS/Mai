const mongoose = require('mongoose');

const moneySchema = mongoose.Schema({

  userID: String,
  MALUser: String,
  MALId: String

});

module.exports = mongoose.model("MAL",moneySchema);
