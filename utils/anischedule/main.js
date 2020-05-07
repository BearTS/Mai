const requireText = require("require-text");
const { getAnnouncementEmbed, getFromNextDays, query } = require("./utils.js");
const watchListData = require('../../models/guildWatchlistSchema.js')
const moment = require('moment')
const { cyan, magenta } = require('chalk')
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

      console.log(`${cyan('[Mai-ALERT]')} : Scheduling announcement for ${e.media.title.romaji} in ${cyan(moment.duration(e.timeUntilAiring,"seconds").format('D [days] H [hours] m [minutes] s [seconds]'))}`);
      queuedNotifications.push(e.id);
      setTimeout(()=> makeAnnouncement(e,date), e.timeUntilAiring * 1000)

    })

    if (res.data.Page.pageInfo.hasNextPage){
      handleSchedules(time, res.data.Page.pageInfo.currentPage + 1)
    }
  });
}

function getAllWatched(){
  return new Promise( async (resolve,reject)=>{
    const watched = [];

    const watchlist = await watchListData.find({})
    if (!watchlist) return console.log(`${red('[Mai-FAIL]')} : Could not get watchlist data (Anisched feature).`)

    watchlist.forEach( guild => {

      guild.data.forEach( s => {

        if (!watched.includes(s)) watched.push(s)

      })
    })

  resolve(watched);

  })
}

async function makeAnnouncement(entry,date,upNext = false){
  queuedNotifications = queuedNotifications.filter(q => q !== entry.id)
  const embed = getAnnouncementEmbed(entry,date,upNext);

  const watchlist = await watchListData.find({})
  if (!watchlist) return console.log(`${red('[Mai-FAIL]')} : Could not get watchlist data (Anisched feature).`)

  watchlist.forEach( g => {

    if (!g || !g.data || !g.data.length || !g.data.includes(entry.media.id)) return

    const channel = bot.channels.cache.find(v => v.id === g.channelID)

    if (!channel) return console.log(`${magenta('[Mai-PROMISE ERROR]')}: Announcement for ${entry.media.title.romaji} failed in ${g.channelID} because such channel doesnt exist!`)

    if (!channel.permissionsFor(channel.guild.me).has('SEND_MESSAGES')) return console.log(`${magenta('[Mai-PROMISE ERROR]')}: Announcement for ${entry.media.title.romaji} failed in ${channel.guild.name} because of missing 'SEND_MESSAGES' permission!`)

    console.log(`${cyan('[Mai-ALERT]')}: Announcing episode ${entry.media.title.romaji} to ${channel.guild.name} @ ${channel.id}`)

    try {
      channel.send(embed)
    } catch (err) {
      console.log(`${cyan('[Mai-ALERT]')}: Failed to announce episode ${entry.media.title.romaji} to ${channel.guild.name} @ ${channel.id}\nMissing Channel Permissions!`)
    }

  })
}
