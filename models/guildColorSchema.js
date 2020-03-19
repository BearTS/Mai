const mongoose = require('mongoose');

const color = mongoose.Schema({
  guildID: String,
  guildName: String,
  colors: {
    type: Array,
    default: []
  }
},{
  bufferCommands: false,
  autoCreate:false

});

module.exports = mongoose.model("ColorRoles",color);
