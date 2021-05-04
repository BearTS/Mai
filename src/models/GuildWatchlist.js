const { model, Schema } = require('mongoose');

module.exports = model('server_watchlists_sample', Schema({
  _id      : String,
  channelID: { type: String, default: null },
  data     : { type: Array , default: []   }
},{
  versionKey: false
}));
