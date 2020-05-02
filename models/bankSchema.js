const mongoose = require('mongoose');

const moneySchema = mongoose.Schema({

    guildID: String,
    userID: String,
    data: {
      wallet : Number,
      bank: Number
    },
    daily: {
      timestamp: { type: Number, default: 0},
      streak: { type: Number, default: 0}
    }
},{

  bufferCommands: false,
  autoCreate:false

});

module.exports = mongoose.model("economyPoints",moneySchema);
