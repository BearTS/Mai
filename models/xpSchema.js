const mongoose = require('mongoose');

const xp = mongoose.Schema({

  guildID: String,
  userID: String,
  points: Number,
  level: Number,
  bg: String

},{

  bufferCommands: false,
  autoCreate:false

});

module.exports = mongoose.model("xperiencePoints",xp);
