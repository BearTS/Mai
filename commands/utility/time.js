const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports.run = async (client, message, args) => {

  const location = args.length ? args.join(' ') : 'Tokyo'
  const res = await fetch(`https://time.is/${location}`).then(res => res.text()).catch(()=>{})

  if (!res) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('The Time.is API did not respond. Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))

try {
  let locale = res.split('\n').filter( w => w.startsWith('markers:[{'))[0].split(':')
  let time = res.split('<time id="clock"')[1].split('<')[0].replace('>','')
  let {latitude, longitude, city, country} = filterLocale(locale)
  let [week, month_day, year] = res.split('title="Click for calendar">')[1].split('</span>')[0].split(',')
  year = year.split('<')[0]
  let [, month, day] = month_day.split(' ')
  let [sunrise, sunset, daylength, solarnoon, info] = res.split('<li>Sunrise:')[1].split('time.</li>')[0].replace('Sunset:','').replace('Day length:','').replace('Solar noon:','').split('</li><li>')

  return message.channel.send( new MessageEmbed()
    .setAuthor(`Time.is`,'https://files.catbox.moe/5iolld.png','https://time.is')
    .setTitle(`${hour12Format(time)}`)
    .setURL(`https://time.is/${encodeURI(city)}`)
    .setDescription(`in **${city}, ${country}**\n*${week}, ${month} ${day}, ${year}*\nCoordinates: [lat: ${latitude}, long: ${longitude}]*\n\n`)
    .addField(`Sunrise`,hour12Format(sunrise),true)
    .addField(`Sunset`,hour12Format(sunset).replace('AM','PM'),true)
    .addField(`Day Length`,daylength,true)
    .addField(`Solar Noon`,hour12Format(solarnoon),true)
    .setFooter(`${info}time.`)
    .setColor('GREY')
  )
} catch (err) {

  return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`\u200B\n\nCouldn't find a city with a name **${location}**`).setThumbnail('https://files.catbox.moe/5iolld.png'))

}

}


module.exports.config = {
  name: "time",
  aliases: ['clock'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "utility",
  guildOnly: true,
  description: "Shows the time for the given location!",
  examples: ["time [city]"],
  parameters: []
}

function filterLocale(locale){
  const [latitude, longitude] = locale[2].replace('[','').replace(']','').replace('name','').split(',')
  const [city, country] = locale[3].replace('"','').replace('"}]','').split(',')
  return {latitude:latitude, longitude:longitude, city:city, country:country}

}

function hour12Format(time){
  let [hh,mm,ss] = time.split(':')
  
  mm = mm.split('AM')[0].split('PM')[0]
  if (!ss) ss = '00'

  if (hh == 00) return `12:${mm}:${ss} AM`
  if (hh > 12) return `${hh-12}:${mm}:${ss} PM`
  return `${hh}:${mm}:${ss} AM`

}
