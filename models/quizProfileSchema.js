const mongoose = require('mongoose');

const quizPlayerProfile = mongoose.Schema({
  user: String,
  id: String,
  guildID: String,
  data: {
    games:{
      started: Number,
      joined: Number,
      won: Number,
      lost: Number,
      surrendered: Number
    },
    scores:{
      total: Number,
      previous: {
        win: Boolean,
        score: Number
      }
    }
  }
},{
  bufferCommands: false,
  autoCreate:false

});

module.exports = mongoose.model("quizProfiles",quizPlayerProfile);
