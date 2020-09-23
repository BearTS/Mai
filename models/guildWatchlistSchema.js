const mongoose = require('mongoose');

const guildWatchlist = mongoose.Schema({
  guildID: String,
  channelID: { type: String, default: null},
  data: { type: Array, default: []}
});

module.exports = mongoose.model("watchlist",guildWatchlist);
