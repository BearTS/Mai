const mongoose = require('mongoose');

const profile = mongoose.Schema({
  guildID: String,
  welcomeChannel: {type: String, default: null},
  welcomemsg:  {type: String, default: null},
  goodbyeChannel:  {type: String, default: null},
  goodbyemsg:  {type: String, default: null},
  isxpActive:  {type: Boolean, default: false},
  xpExceptions: { type: Array, default: []},
  iseconomyActive: {type: Boolean, default: false},
  muterole: {type: String, default: null}
},{

  bufferCommands: false,
  autoCreate:false

});

module.exports = mongoose.model("Guildprofile",profile);
