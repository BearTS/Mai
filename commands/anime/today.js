const settings = require('./../../botconfig.json')
const {RichEmbed} = require('discord.js')
const utils = require('./../../utils/majUtils.js')
const fetch = require('node-fetch')

module.exports.run = (bot,message,args) => {

const today = new Date().getDay()
const weekday = getweekday(today)

fetch(`https://api.jikan.moe/v3/schedule/${weekday}`).then(res => res.json()).then(data => {

  embedResults(data[weekday.toLowerCase()]).then(embeds => {

    message.channel.send(embeds[0]).then(async (msg) => {
      const collector = await msg.createReactionCollector((reaction, user) => user.id === message.author.id)
      let reactions = ['◀', '▶', '❌'];
      for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i]);

      let timeout = setTimeout(function() {
          return collector.stop('timeout');
      }, 120000);

      let n = 0;

      collector.on('collect', async(r)=>{
        if (r.emoji.name === '◀') {
          if (n<1){
            n = embeds.length
        }
          clearTimeout(timeout)
          n--;
          await msg.edit(embeds[n])
        } else if (r.emoji.name === "▶"){
          if (n===embeds.length-1){
            n = -1
          }
          clearTimeout(timeout)
          n++;
          await msg.edit(embeds[n])
        } else if (r.emoji.name === "❌"){
          collector.stop('terminated')
        }

        await r.remove(message.author.id); //Delete user reaction

        timeout = setTimeout(function() {
            collector.stop('timeout');
        }, 120000);

      })

      collector.on('end', async(collected,reason)=>{
        msg.clearReactions()
        if (reason==='timeout'){
          return
        } else if (reason==='terminated') {
          return
        }
      })
    })

  })

}).catch(()=>{message.channel.send(`Sorry, Jikan is down. :(`)})

}

module.exports.help = {
  name: 'anitoday',
  aliases: ["animetoday",'airing'],
	group: 'anime',
	description: 'Displays the list of currently airing anime for today\'s date',
	examples: ['airing'],
	parameters: []
}

function getweekday(day){
  switch (day) {
    case 0:
      return 'Sunday'
    break;
    case 1:
      return 'Monday'
    break;
    case 2:
      return 'Tuesday'
    break;
    case 3:
      return 'Wednesday'
    break;
    case 4:
      return 'Thursday'
    break;
    case 5:
      return 'Friday'
    break;
    default:
      return 'Saturday'
  }
}

function embedResults(data){
  return new Promise((resolve,reject)=>{
    let embeds = []
    data.forEach(anime => {
      let n = new RichEmbed()
      .setTitle(anime.title)
      .setURL(anime.url)
      .setColor(settings.colors.embedDefault)
      .setDescription(utils.textTrunctuate(anime.synopsis,250))
      .addField(`Type`,anime.type,true)
      .addField(`Started`,utils.timeZoneConvert(anime.airing_start),true)
      .addField(`Source`,anime.source,true)
      .addField(`Genres`,extract(anime.genres),true)
      .addField(`Producers`,extract(anime.producers),true)
      .addField(`Licensors`,anime.licensors.length > 0 ? anime.licensors.join(', ') : 'None Found.',true)
      .setThumbnail(anime.image_url)
      embeds.push(n)
    })
    for(let x=0;x<embeds.length;x++){
      embeds[x].setFooter(`Page ${x+1} of ${embeds.length}`,`https://anilist.co/img/icons/android-chrome-512x512.png`)
    }
    resolve(embeds)
  })
}

function extract(data){
  if (data.length<1) return 'No Information.'
  let res = []
  let output;
  data.forEach(d => {
    res.push(`[${d.name}](${d.url})`)
  })
  if (res.length > 1){
  last = res.pop()
  output = res.join(", ")+`, and ${last}`
} else if (res.length === 1){
  output = res.toString()
}
return output
}
