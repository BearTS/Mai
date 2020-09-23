const mongoose = require('mongoose');

const profile = mongoose.Schema({
  guildID: String,
  invite: {
    description: { type: String, default: null },
    link: { type: String, default: null },
  }
});

module.exports = mongoose.model("GuildInvite",profile);
