const requireText = require("require-text");
const { getAnnouncementEmbed, getFromNextDays, query } = require("./utils.js");
const watchListData = require('../../models/guildWatchlistSchema.js')
const { cyan, magenta } = require('chalk')
const mongoose = require('mongoose')
let queuedNotifications = [];
let bot;

module.exports.ready = (client) => {
  bot = client
  handleSchedules(Math.round(getFromNextDays().getTime() / 1000)); // Initial run
  return setInterval(() => handleSchedules(Math.round(getFromNextDays().getTime() / 1000)), 1000 * 60 * 60 * 24); // Schedule future runs every 24 hours
}

async function handleSchedules(time,page){
  const pages = await getAllWatched()

  query(requireText("./query/Schedule.graphql",require),{page: page, watched: pages, nextDay: time}).then(res=>{

    if (res.errors){

      console.log(`${magenta('[Mai-Promise ERROR]')} :\n${JSON.stringify(res.errors)}`);

    }

    res.data.Page.airingSchedules.forEach(e => {
      const date = new Date(e.airingAt * 1000)
      if (queuedNotifications.includes(e.id))
        return;

      console.log(`${cyan('[Mai-ALERT]')} : Scheduling announcement for ${e.media.title.romaji} on ${date}`);
      queuedNotifications.push(e.id);
      setTimeout(()=> makeAnnouncement(e,date),e.timeUntilAiring * 1000)

    })

    if (res.data.Page.pageInfo.hasNextPage){
      handleSchedules(time, res.data.Page.pageInfo.currentPage + 1)
    }
  });
}

function getAllWatched(){
  return new Promise((resolve,reject)=>{
    const watched = [];
     mongoose.connection.db.collection('watchlists', function(err,collection){
       if (err) return console.log(`${red('[Mai-FAIL]')} : Could not get watchlist data (Anisched feature).`)
       collection.find({}).toArray( function(err,watchlist){
         if (err) return console.log(`${red('[Mai-FAIL]')} : Could not get watchlist data (Anisched feature).`)
         watchlist.forEach(guild => {
            guild.data.forEach(s => {
              if (!watched.includes(s))
              watched.push(s)
            })
          })
          resolve(watched);
        })
      })
  })
}

function makeAnnouncement(entry,date,upNext = false){
  queuedNotifications = queuedNotifications.filter(q => q !== entry.id)
  const embed = getAnnouncementEmbed(entry,date,upNext);

  mongoose.connection.db.collection('watchlists', function(err,collection){
    collection.find({}).toArray(function(err,watchlist){
      watchlist.forEach(g => {
        if (!g || !g.data || !g.data.length)
        return;

        if (g.data.includes(entry.media.id)){
          const channel = bot.channels.cache.find(v => v.id === g.channelID)
          if (channel) {
            console.log(`${cyan('[Mai-ALERT]')}: Announcing episode ${entry.media.title.romaji} to ${channel.guild.name}@${channel.id}`)
            channel.send(embed)
          }
        }
      })
    })
  })
}
