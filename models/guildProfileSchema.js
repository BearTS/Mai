const mongoose = require('mongoose');

const profile = mongoose.Schema({
  guildID: String,
  welcomeEnabled: {type: Boolean, default: false},
  welcomeEmbed: {type: Object, default: {}},
  isWelcomeEmbed: {type: Boolean, default: false},
  welcomeChannel: {type: String, default: null},
  welcomemsg:  {type: String, default: null},
  welcomeUse: {type: String, default: 'default'},
  goodbyeEnabled: {type: Boolean, default: false},
  goodbyeEmbed: {type: Object, default: null},
  isGoodbyeEmbed: {type: Boolean, default: false},
  goodbyeChannel: {type: String, default: null},
  goodbyemsg:  {type: String, default: null},
  goodbyeUse: {type: String, default: 'default'},
  isxpActive:  {type: Boolean, default: false},
  xpExceptions: { type: Array, default: []},
  iseconomyActive: {type: Boolean, default: false},
  muterole: {type: String, default: null},
  suggestChannel: {type: String, default: null}
});

module.exports = mongoose.model("Guildprofile",profile);
