const requireText = require("require-text");
const settings = require('./../../botconfig.json')
const commands = require("./commands");
const {getAnnouncementEmbed, getFromNextDays, query} = require("./util");
const commandPrefix = settings.prefix;
const watchListData = require('./../../models/guildWatchlistSchema.js')
let queuedNotifications = [];
const mongoose = require('mongoose')
let bot;

const ready = (client) => {
  bot = client
  handleSchedules(Math.round(getFromNextDays().getTime() / 1000)); // Initial run
  return setInterval(() => handleSchedules(Math.round(getFromNextDays().getTime() / 1000)), 1000 * 60 * 60 * 24); // Schedule future runs every 24 hours
}

const readCommand = (msg) => {

  if (!msg.guild) return

  if (msg.author.bot) return
  const msgContent = msg.content.split(/ +/);

  if (msgContent[0].startsWith(commandPrefix)){
    const command = commands[msgContent[0].substr(commandPrefix.length)]
    if (command) {
      watchListData.findOne({
        guildID: msg.guild.id,
        channelID: msg.channel.id
      }, (err,wldata) =>{
        if (err) return msg.react("👎")
        if (!wldata) {
          const reg = new watchListData({
            guildID:msg.guild.id,
            guildName: msg.guild.name,
            channelID: msg.channel.id,
            channelName: msg.channel.name,
            data: []
          })
          reg.save().then((data)=>{
            const promise = command.handle(msg, msgContent.slice(1), data)
            if (promise) {
              promise.then( ret => {
                if (ret) {
                  data = ret
                  data.save()
                }
              })
              }
          })
        }
        else {
        const promise = command.handle(msg, msgContent.slice(1), wldata)
        if (promise) {
        promise.then( ret => {
          if (ret) {
            wldata = ret
            wldata.save()
          }
        })
        }}
      })
    }
  }
}

module.exports = {
  readCommand,
  ready
}

async function handleSchedules(time,page){
  const pages = await getAllWatched()
  query(requireText("./query/Schedule.graphql",require),{page: page, watched: pages, nextDay: time}).then(res=>{
    if (res.errors){
      console.log(JSON.stringify(res.errors));
      return;
    }

    res.data.Page.airingSchedules.forEach(e => {
      const date = new Date(e.airingAt * 1000)
      if (queuedNotifications.includes(e.id))
        return;

      console.log(`Scheduling announcement for ${e.media.title.romaji} on ${date}`);
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
       collection.find({}).toArray( function(err,watchlist){
         watchlist.forEach(channel => {
            channel.data.forEach(s => {
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
      watchlist.forEach(ch => {
        if (!ch || !ch.data || ch.data.length === 0)
        return;

        if (ch.data.includes(entry.media.id)){
          const channel = bot.channels.find(v => v.id === ch.channelID)
          if (channel) {
            console.log(`Announcing episode ${entry.media.title.romaji} to ${channel.guild.name}@${channel.id}`)
            channel.send({embed})
          }
        }
      })
    })
  })
}
