const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: "time",
  aliases: ['clock'],
  guildOnly: true,
  group: "utility",
  description: "Shows the time for the given location!",
  examples: ["time [city]"],
  parameters: [],
  run: async (client, message, args) => {

    const location = args.length ? args.join(' ') : 'Tokyo'
    const res = await fetch(`https://time.is/${location}`).then(res => res.text()).catch(()=>{})

    if (!res) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('The Time.is API did not respond. Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))

  try {

    const [ latitude, longitude ] = JSON.parse(res.match(/\[(\d{1,3}.\d{1,7},\d{1,3}.\d{1,7})\]/gi)[0])
    const [ city, country ] = JSON.parse(res.match(/\"(([0-9A-Z\s]*),\s([0-9A-Z\s]*))\"/gi)[0]).split(', ')
    const [ time ] = res.match(/(\d{1,2}):(\d{1,2}):(\d{1,2}[\s+apm]{2,}|\d{1,2})/gi)
    const [ weekday, month, day, year ] = res.match(/(\w{1,9}),\s(\w{1,12})\s(\d{1,2}),\s(\d{4})/gi)[0].replace(/,/g,'').split(' ')
    const [ sunrise, sunset, daylength, solarnoon ] = res.match(/(?<=(\w{1,10}\s\w{1,10}|\w{1,10}):\s+)(\d{2}|\d{2}h)(:|\s+)(\d{1,2}m|\d{1,2})/gi)
    const info = res.match(/(the\s+current\s+local\s+time\s+in\s+([a-z\s]*)+\s+is\s+\d+\s+(minutes*)\s+(ahead\s+of|behind)\s+apparent\s+solar\s+time.)/gi)[0]

    return message.channel.send( new MessageEmbed()

      .setAuthor(`Time.is`,'https://files.catbox.moe/5iolld.png','https://time.is')

      .setTitle(`${hour12Format(time)}`)

      .setURL(`https://time.is/${encodeURI(city)}`)

      .setDescription(`in **${city}, ${country}**\n*${weekday}, ${month} ${day}, ${year}*\nCoordinates: [lat: ${latitude}, long: ${longitude}]*\n\n`)

      .addField(
          `Sunrise`
        , hour12Format(sunrise)
        , true)

      .addField(
          `Sunset`
        , hour12Format(sunset)
        , true)

      .addField(
          `Day Length`
        , daylength
        , true)

      .addField(
          `Solar Noon`
        , hour12Format(solarnoon)
        , true)

      .setFooter(`${info}.`)

      .setColor('GREY')
    )
  } catch (err) {

    return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`\u200B\n\nCouldn't find a city with a name **${location}**`).setThumbnail('https://files.catbox.moe/5iolld.png'))

    }
  }
}



function hour12Format(time){

  if (time.toLowerCase().endsWith('am') || time.toLowerCase().endsWith('pm')) return time

  let [ hh, mm, ss] = time.split(':')

  if (!ss) ss = '00'

  if (hh == 00) return `12:${mm}:${ss} AM`
  if (hh > 12) return `${hh-12}:${mm}:${ss} PM`
  return `${hh}:${mm}:${ss} AM`

}
