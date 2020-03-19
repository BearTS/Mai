const quizProfile = require('./../../models/quizProfileSchema.js')

const addGamesJoined = (message,data) => {
  return new Promise((resolve, reject) => {
    quizProfile.findOne({
      id: data.id,
      guildID: message.guild.id
    }, (err, profile) => {
        if (err) return console.log(`Warning: failed to connect to database @ addGamesJoined`);
        if (!profile) {
          const newProfile = new quizProfile({
            user: data.user,
            id: data.id,
            guildID: message.guild.id,
            data: {
              games: {
                started: 0,
                joined: 1,
                won: 0,
                lost: 0,
                surrendered: 0
              },
              scores:{
                total: 0, 
                previous: {
                  win: false,
                  score: 0
                }
              }
            }
          })
          return newProfile.save()
          resolve()
        } else {
        profile.data.games.joined = profile.data.games.joined + 1
        profile.save()
        resolve()
        }
      })
    })
  }

const addGamesStarted = (message,data) => {
    return new Promise((resolve,reject) => {
      quizProfile.findOne({
        id: data.id,
        guildID: message.guild.id
      }, (err,profile) => {
        if (err) return console.log(`Warning: failed to connect to database @ addGamesStarted`)
        if (!profile) {
          const newProfile = new quizProfile({
            user: data.user,
            id: data.id,
            guildID: message.guild.id,
            data: {
              games: {
                started: 1,
                joined: 0,
                won: 0,
                lost: 0,
                surrendered: 0
              },
              scores:{
                total: 0,
                previous: {
                  win: false,
                  score: 0
                }
              }
            }
          })
          return newProfile.save()
          resolve()
        } else {
        profile.data.games.started = profile.data.games.started + 1
        profile.save()
        resolve()
        }
      })
    })
  }

const addGamesWon = (message,data,points) => {
  return new Promise((resolve,reject)=>{
    quizProfile.findOne({
      id: data.id,
      guildID: message.guild.id
    }, (err,profile)=>{
      if (err) return console.log(`Warning: failed to connect to database @ addGamesWon`)
      profile.data.games.won = profile.data.games.won + 1
      profile.data.scores.total = profile.data.scores.total + points
      profile.data.scores.previous.win = true
      profile.data.scores.previous.score = points
      profile.save()
      resolve()
    })
  })
}

addGamesLost = (message,data,points) => {
  return new Promise((resolve,reject)=>{
    quizProfile.findOne({
      id: data.id,
      guildID: message.guild.id
    }, (err,profile)=>{
      if (err) return console.log(`Warning: failed to connect to database @ addGamesLost`)
      profile.data.games.lost = profile.data.games.lost + 1
      profile.data.scores.total = (profile.data.scores.total>points) ? profile.data.scores.total - points : 0
      profile.data.scores.previous.win = false
      profile.data.scores.previous.score = points
      profile.save()
      resolve()
    })
  })
}

addGamesSurrendered = (message,data,points) => {
  return new Promise((resolve,reject)=>{
    quizProfile.findOne({
      id:data.id,
      guildID: message.guild.id
    }, (err,profile) => {
      if (err) return console.log(`Warning: failed to connect to database @ addGamesLost`)
      profile.data.games.surrendered = profile.data.games.surrendered + 1
      profile.data.games.lost = profile.data.games.lost + 1
      profile.data.scores.total = (profile.data.scores.total>points) ? profile.data.scores.total - points : 0
      profile.data.scores.previous.win = false
      profile.data.scores.previous.score = points
      profile.save()
      resolve()
    })
  })
}

module.exports = {
  addGamesJoined,
  addGamesStarted,
  addGamesWon,
  addGamesLost,
  addGamesSurrendered
}
