const mongoose = require('mongoose');

const quizPlayerProfile = mongoose.Schema({
  userID: String,
  guildID: String,
  data: {
    games:{
      started: { type: Number, default: 0},
      joined: { type: Number, default: 0},
      won: { type: Number, default: 0},
      lost: { type: Number, default: 0},
      surrendered: { type: Number, default: 0},
    },
    scores:{
      total: { type: Number, default: 0},
      previous: {
        win: { type: Boolean, default: false},
        score: { type: Number, default: 0},
      }
    }
  }
},{
  bufferCommands: false,
  autoCreate:false
});

module.exports = mongoose.model("quizProfiles",quizPlayerProfile);
