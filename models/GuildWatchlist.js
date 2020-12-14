const { model, Schema } = require('mongoose');

module.exports = model('watchlist', Schema({
  guildID: String,
  channelID: { type: String, default: null },
  data: { type: Array, default: []}
},{
  versionKey: false
}));
