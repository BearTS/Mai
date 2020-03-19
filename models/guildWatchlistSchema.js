const mongoose = require('mongoose');

const guildWatchlist = mongoose.Schema({
  guildID: String,
  GuildName: String,
  channelID: String,
  channelName: String,
  data: { type: Array, default: []}
},{
  bufferCommands: false,
  autoCreate:false

});

module.exports = mongoose.model("watchlist",guildWatchlist);
