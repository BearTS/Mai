const AniSchedule = require('./../utils/anischedule/main.js')


module.exports = async bot => {
  console.log(`'${bot.user.username}' is online on ${bot.guilds.size} servers!`);
  const status = [
    "SeishunButaBots.org"
  ]
  const types = [
    "PLAYING", "WATCHING", "LISTENING"
  ]
  let activeStatus;
  let activeType;

  const randomizer = async () => {
    activeType = types[Math.floor(Math.random()*(types.length-1))]
    activeStatus = status[Math.floor(Math.random()*(status.length-1))]

    if (activeType === "LISTENING"){
      activeStatus = "to " + activeStatus
    }

    return stats = {
      activeStatus: activeStatus,
      activeType: activeType
    }
  }

  setInterval(()=>{
    randomizer().then(stats => {
      bot.user.setActivity(stats.activeStatus,{
        type: stats.activeType
      })
    })
  },20000)


  setTimeout(()=>{AniSchedule.ready(bot)},120000)

//--------------------Anime Airing Schedule Notifier. Courtesy of TeHNut. Support TeHNut on github -------------------/

}
