const mongoose = require('mongoose');

const xp = mongoose.Schema({
  guildID: String,
  userID: String,
  xp: Number,
  level: Number
},{
  bufferCommands: false,
  autoCreate:false

});

module.exports = mongoose.model("xperiencePoints",xp);
