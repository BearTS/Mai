const mongoose = require('mongoose');

const xp = mongoose.Schema({

  guildID: String,
  userID: String,
  points: {type: Number, default: 0},
  level: {type: Number, default: 1},
  bg: {type: String, default: null}

},{

  bufferCommands: false,
  autoCreate:false

});

module.exports = mongoose.model("xperiencePoints",xp);
